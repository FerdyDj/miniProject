import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.paymentController = new PaymentController();
    this.InitializeRoute();
  }

  private InitializeRoute() {
    this.router.get(
        "/",
        this.authMiddleware.verifyToken,
        this.paymentController.getTicketPayment
      );
  }

  getRouter(): Router {
    return this.router;
  }
}


