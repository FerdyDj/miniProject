"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscountRouter = void 0;
const express_1 = require("express");
const discount_controller_1 = require("../controllers/discount.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class DiscountRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.discountController = new discount_controller_1.DiscountController();
        this.InitializeRoute();
    }
    InitializeRoute() {
        this.router.get("/:customerId", this.authMiddleware.verifyToken, this.discountController.getDiscountByCustomerId);
    }
    getRouter() {
        return this.router;
    }
}
exports.DiscountRouter = DiscountRouter;
