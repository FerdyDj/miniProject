import { Request, Response } from "express";
import prisma from "../prisma";

export class PaymentController {
    async getTicketPayment(req: Request, res: Response) {
        try {
          const { id: customerId, role } = req.customer!;
          if (!customerId || role !== "CUSTOMER")
            throw { message: "Unauthorized!" };
    
          const orders = await prisma.order.findMany({
            where: { customerId },
            include: { ticket: { include: { event: true } } },
            orderBy: { createdAt: "desc"}
          });
    
          res.status(200).send({
            message: "Data Order tickets",
            orders,
          });
        } catch (err) {
          console.log(err);
          res.status(400).send(err);
        }
      }
}