import { Router } from "express";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { TicketController } from "../controllers/ticket.controller";

export class TicketRouter {
  private router: Router;
  private ticketController: TicketController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.ticketController = new TicketController();
    this.authMiddleware = new AuthMiddleware();
    this.InitialiazeRoute();
  }

  private InitialiazeRoute() {
    this.router.get("/", this.ticketController.getTicket);
    this.router.post(
      "/:eventId",
      this.authMiddleware.verifyTokenOrganizer,
      this.ticketController.createTicket
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
