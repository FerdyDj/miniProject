"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRouter = void 0;
const express_1 = require("express");
const review_controller_1 = require("../controllers/review.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class ReviewRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.reviewController = new review_controller_1.ReviewController();
        this.InitializeRoute();
    }
    InitializeRoute() {
        this.router.get("/:eventId", this.reviewController.getReview);
        this.router.post("/:eventId", this.authMiddleware.verifyToken, this.reviewController.postReview);
    }
    getRouter() {
        return this.router;
    }
}
exports.ReviewRouter = ReviewRouter;
