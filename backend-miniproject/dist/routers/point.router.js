"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PointRouter = void 0;
const express_1 = require("express");
const point_controller_1 = require("../controllers/point.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
class PointRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.pointController = new point_controller_1.PointController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.InitializeRoute();
    }
    InitializeRoute() {
        this.router.get("/:customerId", this.authMiddleware.verifyToken, this.pointController.getPoint);
    }
    getRouter() {
        return this.router;
    }
}
exports.PointRouter = PointRouter;
