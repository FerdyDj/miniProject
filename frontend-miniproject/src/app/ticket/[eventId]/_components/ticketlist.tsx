"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";

interface Ticket {
  id: string;
  category: string;
  price: number;
  quantity: number;
}

export default function TicketsList({ eventId }: { eventId: string }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`/tickets/${eventId}`, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        setTickets(res.data.tickets);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch tickets");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [eventId, session]);

  if (loading) return <p className="text-center">Loading tickets...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-2 text-gray-800 text-shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Tickets</h2>
      {tickets.length === 0 ? (
        <p className="text-white">No tickets available for this event yet.</p>
      ) : (
        <div className="flex flex-col w-full">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="border bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-md p-4 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-bold text-lg">{ticket.category}</h3>
              <p className="">Price: IDR {ticket.price.toLocaleString()}</p>
              <p className="">Stock: {ticket.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
