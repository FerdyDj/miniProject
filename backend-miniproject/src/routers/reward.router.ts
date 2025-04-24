import { Router } from "express";
import { RewardController } from "../controllers/reward.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class RewardRouter {
  private router: Router;
  private rewardController: RewardController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.rewardController = new RewardController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.get(
      "/",
      this.authMiddleware.verifyToken,
      this.rewardController.getReward
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
