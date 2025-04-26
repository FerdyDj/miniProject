import { Request, Response } from "express";
import prisma from "../prisma";
import { cloudinaryUpload } from "../helpers/cloudinary";

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      if (!req.file) throw { message: "Image Empty!" };
      const {
        title,
        category,
        eventDate,
        startTime,
        endTime,
        location,
        venue,
        description,
      } = req.body;
      const { secure_url } = await cloudinaryUpload(req.file, "HoopPass");
      
      await prisma.event.create({
        data: {
          image: secure_url,
          title,
          category,
          eventDate: new Date(eventDate),
          startTime,
          endTime,
          location,
          venue,
          description,
          organizerId: req.organizer?.id!,
        },
      });

      res.status(201).send({
        message: "Event Created ✅",
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getEvent(req: Request, res: Response) {
    try {
      const events = await prisma.event.findMany({
        select: {
          id: true,
          image: true,
          title: true,
          category: true,
          eventDate: true,
          startTime: true,
          endTime: true,
          location: true,
          venue: true,
          description: true,
          organizer: {
            select: {
              fullname: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.status(200).send({
        message: "Data events",
        data: events,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
