import { Request, Response } from "express";
import prisma from "../prisma";

export class TicketController {
  async createTicket(req: Request, res: Response) {
    try {
      const {id: organizerId, role } = req.organizer!;
      if (!organizerId || role !== "ORGANIZER") throw { message: "Unauthorized!" };

      const { eventId } = req.params;
      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if(!event) throw { message: "Event not found!" }

      const { category, price, quantity } = req.body;

      await prisma.ticket.create({
        data: {
          category,
          price,
          quantity,
          eventId,
        },
      });

      res.status(201).send({
        message: "Ticket Created ✅",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getTicket(req: Request, res: Response) {
    try {
      const tickets = await prisma.ticket.findMany({
        include: { event: true },
      });

      res.status(200).send({
        message: "Data tickets",
        tickets,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
