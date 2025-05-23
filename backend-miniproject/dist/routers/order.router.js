"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRouter = void 0;
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class OrderRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.orderController = new order_controller_1.OrderController();
        this.InitializeRouter();
    }
    InitializeRouter() {
        this.router.post("/", this.authMiddleware.verifyToken, this.orderController.createOrder);
        this.router.get("/:customerId", this.authMiddleware.verifyToken, this.orderController.getOrderByCustomerId);
        this.router.post("/status", this.orderController.updateStatus);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrderRouter = OrderRouter;
