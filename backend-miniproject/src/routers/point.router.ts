import { Router } from "express";
import { PointController } from "../controllers/point.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PointRouter {
  private router: Router;
  private pointController: PointController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.pointController = new PointController();
    this.authMiddleware = new AuthMiddleware();
    this.InitializeRoute();
  }

  private InitializeRoute() {
    this.router.get(
      "/:customerId",
      this.authMiddleware.verifyToken,
      this.pointController.getPoint
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
