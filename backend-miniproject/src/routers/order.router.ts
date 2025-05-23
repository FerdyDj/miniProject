import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.orderController = new OrderController();
    this.InitializeRouter();
  }

  private InitializeRouter() {
    this.router.post(
      "/",
      this.authMiddleware.verifyToken,
      this.orderController.createOrder
    );
    this.router.get(
      "/:customerId",
      this.authMiddleware.verifyToken,
      this.orderController.getOrderByCustomerId
    );
    this.router.post(
      "/status",
      this.orderController.updateStatus
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
