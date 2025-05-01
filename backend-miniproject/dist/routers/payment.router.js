"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRouter = void 0;
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PaymentRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.paymentController = new payment_controller_1.PaymentController();
        this.InitializeRoute();
    }
    InitializeRoute() {
        this.router.get("/", this.authMiddleware.verifyToken, this.paymentController.getTicketPayment);
    }
    getRouter() {
        return this.router;
    }
}
exports.PaymentRouter = PaymentRouter;
