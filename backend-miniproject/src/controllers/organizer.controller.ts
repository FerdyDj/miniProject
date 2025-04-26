import { Request, Response } from "express";
import prisma from "../prisma";

export class OrganizerController {
  async getOrganizerId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const organizer = await prisma.organizer.findUnique({
        where: { id: +id },
        select: {
          id: true,
          fullname: true,
          avatar: true,
        },
      });

      if (!organizer) throw { message: "Organizer not found!" };

      res.status(200).send(organizer);
    } catch (err) {
      console.error(err);
      res.status(400).send(err);
    }
  }
}
