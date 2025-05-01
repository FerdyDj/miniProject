import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { AuthMiddleware } from "../middleware/auth.middleware";

export class ReviewRouter {
  private router: Router;
  private authMiddleware: AuthMiddleware;
  private reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.authMiddleware = new AuthMiddleware();
    this.reviewController = new ReviewController();
    this.InitializeRoute();
  }

  private InitializeRoute() {
    this.router.get("/:eventId", this.reviewController.getReview);
    this.router.post(
      "/:eventId",
      this.authMiddleware.verifyToken,
      this.reviewController.postReview
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
