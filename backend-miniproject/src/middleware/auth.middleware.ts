import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { CustomerPayload, OrganizerPayload } from "../../custom";

export class AuthMiddleware {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw { message: "Unauthorized!" };

      const verifiedCustomer = verify(token, process.env.KEY_JWT!);

      req.customer = verifiedCustomer as CustomerPayload;

      next();
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  verifyTokenOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) throw { message: "Unauthorized!" };

      const verifiedOrganizer = verify(token, process.env.KEY_JWT!);

      req.organizer = verifiedOrganizer as OrganizerPayload;

      next();
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
