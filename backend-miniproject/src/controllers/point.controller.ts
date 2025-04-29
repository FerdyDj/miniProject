import { Request, Response } from "express";
import prisma from "../prisma";

export class PointController {
  async getPoint(req: Request, res: Response) {
    try {
      const { id: customerId, role } = req.customer!;

      if (!customerId || role !== "CUSTOMER")
        throw { message: "Unauthorized!" };

      const points = await prisma.point.findMany({
        where: { customerId },
        select: {
          id: true,
          amount: true,
          expiredAt: true,
        },
      });

      const stat = await prisma.point.aggregate({
        where: { customerId },
        _sum: { amount: true },
      });

      res.status(200).send({
        points,
        stat,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
