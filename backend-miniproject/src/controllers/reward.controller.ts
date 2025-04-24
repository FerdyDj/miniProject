import { Request, Response } from "express";
import prisma from "../prisma";

export class RewardController {
  async getReward(req: Request, res: Response) {
    try {
      const customerId = req.customer?.id;

      if (!customerId) throw { message: "Unauthorized!" };

      const points = await prisma.point.findMany({
        where: { customerId },
        select: {
          id: true,
          amount: true,
          expiredAt: true,
        },
      });

      const coupon = await prisma.discount.findFirst({
        where: { customerId, used: false },
        select: {
          id: true,
          percen: true,
          expiredAt: true,
        },
      });

      res.status(200).send({
        points,
        coupon,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
