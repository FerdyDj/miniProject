import { Request, Response } from "express";
import prisma from "../prisma";
import { DateTime } from 'luxon';

export class DashboardController {
  getDashboardSummary = async (req: Request, res: Response) => {
    try {
      const [totalEvents, totalOrders, profitAgg, ticketAgg] =
        await Promise.all([
          prisma.event.count(),
          prisma.order.count({ where: { status: "PAID" } }),
          prisma.order.aggregate({
            _sum: { amount: true },
            where: { status: "PAID" },
          }),
          prisma.order.aggregate({
            _sum: { qty: true },
            where: { status: "PAID" },
          }),
        ]);

      res.json({
        totalEvents,
        totalOrders,
        totalProfit: profitAgg._sum.amount || 0,
        totalTickets: ticketAgg._sum.qty || 0,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to get dashboard summary", err });
    }
  };

  async getEventChart(req: Request, res: Response) {
    try {
      const data = await this.countByMonth("event");
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to get event chart", err });
    }
  }

  async getTransactionChart(req: Request, res: Response) {
    try {
      const data = await this.countByDay("order", "PAID");
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: "Failed to get transaction chart", err });
    }
  }

  async getTicketChart(req: Request, res: Response) {
    try {
      const currentYear = new Date().getFullYear();
      const result = await Promise.all(
        [currentYear - 1, currentYear].map(async (year) => {
          const start = new Date(year, 0, 1);
          const end = new Date(year, 11, 31, 23, 59, 59);
          const agg = await prisma.order.aggregate({
            _sum: { qty: true },
            where: { createdAt: { gte: start, lte: end }, status: "PAID" },
          });
          return { year, total: agg._sum.qty || 0 };
        })
      );
      res.json(result);
    } catch (err) {
      res.status(500).json({ message: "Failed to get ticket chart", err });
    }
  }

  // Helpers
  private async countByMonth(model: "event" | "order", status?: string) {
    const now = DateTime.now().setZone("Asia/Jakarta");
    const year = now.year;
    const results = [];
  
    for (let i = 0; i < 12; i++) {
      const month = i + 1;
  
      const start = DateTime.fromObject({ year, month, day: 1 }, { zone: "Asia/Jakarta" }).startOf('day').toUTC();
      const end = DateTime.fromObject({ year, month }, { zone: "Asia/Jakarta" }).endOf('month').toUTC();
  
      const where: any = {
        createdAt: {
          gte: start.toJSDate(),
          lte: end.toJSDate(),
        },
      };
  
      if (status) where.status = status;
  
      const count = await (prisma[model] as any).count({ where });
  
      results.push({
        name: start.setZone('Asia/Jakarta').toFormat('LLLL'), // Nama bulan: "Mei"
        total: count,
      });
    }
  
    return results;
  }

  private async countByDay(model: "order", status?: string) {
    const now = DateTime.now().setZone("Asia/Jakarta");
    const results = [];
  
    for (let i = 6; i >= 0; i--) {
      const current = now.minus({ days: i });
      const start = current.startOf("day").toUTC();
      const end = current.endOf("day").toUTC();
  
      const where: any = {
        createdAt: {
          gte: start.toJSDate(),
          lte: end.toJSDate(),
        },
      };
  
      if (status) where.status = status;
  
      const count = await prisma[model].count({ where });
  
      results.push({
        name: current.toFormat("yyyy-MM-dd"), // Misalnya "2025-05-01"
        total: count,
      });
    }
  
    return results;
  }
  
}