import { Router } from "express";
import { OrganizerController } from "../controllers/organizer.controller";

export class OrganizerRouter {
  private router: Router;
  private organizerController: OrganizerController;

  constructor() {
    this.router = Router();
    this.organizerController = new OrganizerController();
    this.InitializeRoute();
  }

  private InitializeRoute() {
    this.router.get("/:id", this.organizerController.getOrganizerId);
  }

  getRouter(): Router {
    return this.router;
  }
}
