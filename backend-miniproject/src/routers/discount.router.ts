import { Router } from "express";
import { DiscountController } from "../controllers/discount.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.discountController = new DiscountController();
    this.InitializeRoute();
  }

  private InitializeRoute() {
    this.router.get(
      "/:customerId",
      this.authMiddleware.verifyToken,
      this.discountController.getDiscountByCustomerId
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
