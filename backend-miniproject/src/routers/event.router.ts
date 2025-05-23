import { Router } from "express";
import { EventController } from "../controllers/event.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { uploader } from "../helpers/uploader";

export class EventRouter {
  private router: Router;
  private eventController: EventController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.authMiddleware = new AuthMiddleware();
    this.InitialiazeRoute();
  }

  private InitialiazeRoute() {
    this.router.get("/", this.eventController.getEvent);
    this.router.get("/:id", this.eventController.getEventById);
    this.router.get(
      "/organizer/:organizerId",
      this.authMiddleware.verifyTokenOrganizer,
      this.eventController.getEventByOrganizerId
    );
    this.router.post(
      "/cloud",
      uploader("memoryStorage", "hp-").single("image"),
      this.authMiddleware.verifyTokenOrganizer,
      this.eventController.createEvent
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
