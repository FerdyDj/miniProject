'use client';

import { useEffect, useState } from 'react';
import { DashboardSummary, ChartData } from '@/types/dashboard';
import {
  CalendarIcon,
  ShoppingCartIcon,
  DollarSignIcon,
  TicketIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { FaRupiahSign } from 'react-icons/fa6';

const API_BASE = 'http://localhost:8000/api/dashboard';

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [eventChartData, setEventChartData] = useState<ChartData[]>([]);
  const [transactionChartData, setTransactionChartData] = useState<ChartData[]>([]);
  const [ticketChartData, setTicketChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [sumRes, evRes, trRes, tkRes] = await Promise.all([
          fetch(`${API_BASE}/summary`),
          fetch(`${API_BASE}/events-per-month`),
          fetch(`${API_BASE}/transactions-per-day`),
          fetch(`${API_BASE}/tickets-per-year`),
        ]);

        if (!sumRes.ok || !evRes.ok || !trRes.ok || !tkRes.ok) {
          throw new Error('One or more requests failed');
        }

        const sumData: DashboardSummary = await sumRes.json();
        const evData: ChartData[] = await evRes.json();
        const trData: ChartData[] = await trRes.json();
        const tkData: ChartData[] = await tkRes.json();

        setSummary(sumData);
        setEventChartData(evData);
        setTransactionChartData(trData);
        setTicketChartData(tkData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading dashboard...</div>;
  }

  if (!summary) {
    return <div className="p-6 text-center text-red-500">Failed to load summary.</div>;
  }

  const cards = [
    {
      title: 'Total Events',
      value: summary.totalEvents.toString(),
      icon: <CalendarIcon className="w-6 h-6 text-indigo-600" />,
    },
    {
      title: 'Total Orders',
      value: summary.totalOrders.toString(),
      icon: <ShoppingCartIcon className="w-6 h-6 text-green-600" />,
    },
    {
      title: 'Total Profit',
      value: `Rp ${summary.totalProfit.toLocaleString('id-ID')}`,
      icon: <FaRupiahSign className="w-6 h-6 text-emerald-600" />,
    },
    {
      title: 'Total Tickets',
      value: summary.totalTickets.toString(),
      icon: <TicketIcon className="w-6 h-6 text-yellow-600" />,
    },
  ];

  const renderChart = (data: ChartData[]) =>
    data.length === 0 ? (
      <div className="h-[200px] flex items-center justify-center text-gray-400">
        No data
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart layout="vertical" data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Bar dataKey="total" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <SummaryCard key={card.title} {...card} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="Event Chart" subtitle="Total events / month">
          {renderChart(eventChartData)}
        </ChartCard>

        <ChartCard title="Transaction Chart" subtitle="Transactions / day">
          {renderChart(transactionChartData)}
        </ChartCard>

        <ChartCard title="Ticket Chart" subtitle="Tickets / year">
          {renderChart(ticketChartData)}
        </ChartCard>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between border">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-indigo-700">{value}</p>
      </div>
      <div className="bg-indigo-50 p-2 rounded-full">{icon}</div>
    </div>
  );
}

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border flex flex-col justify-between">
      <div>
        <h2 className="text-md font-semibold text-gray-700 mb-2">{title}</h2>
        {children}
      </div>
      <p className="text-xs text-gray-400 mt-4">{subtitle}</p>
    </div>
  );
}