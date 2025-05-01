import { Request, Response } from "express";
import prisma from "../prisma";

export class ReviewController {
  async getReview(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const reviews = await prisma.review.findMany({
        where: { eventId },
        include: {
          customer: { select: { id: true, avatar: true, fullname: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).send({ reviews });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async postReview(req: Request, res: Response) {
    try {
      const { id: customerId, role } = req.customer!;

      if (!customerId || role !== "CUSTOMER")
        throw { message: "Unauthorized!" };

      const { eventId } = req.params;

      const event = await prisma.event.findUnique({ where: { id: eventId } });

      if (!event) throw { message: "Event not found!" };

      const { rating, comment } = req.body;

      await prisma.review.create({
        data: { eventId, customerId, rating, comment: comment || null },
      });

      res.status(201).send({ message: "Review Created ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
