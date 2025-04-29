import { Request, Response } from "express";
import prisma from "../prisma";

export class DiscountController {
  async getDiscountByCustomerId(req: Request, res: Response) {
    try {
      const {id: customerId, role} = req.customer!;

      if (!customerId || role !== "CUSTOMER") throw { message: "Unauthorized!" };

      const discount = await prisma.discount.findFirst({
        where: { customerId, used: false },
        select: {
          id: true,
          percen: true,
          expiredAt: true,
        },
      });

      res.status(200).send({
        discount,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
