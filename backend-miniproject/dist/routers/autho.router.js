"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthoRouter = void 0;
const express_1 = require("express");
const validation_1 = require("../middleware/validation");
const auth_middleware_1 = require("../middleware/auth.middleware");
const autho_controller_1 = require("../controllers/autho.controller");
class AuthoRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.authoController = new autho_controller_1.AuthoController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.initializeRoute();
    }
    initializeRoute() {
        this.router.post("/", validation_1.validateRegister, this.authoController.registerOrganizer);
        this.router.post("/login", this.authoController.loginOrganizer);
        this.router.patch("/verifyo", this.authMiddleware.verifyTokenOrganizer, this.authoController.verifyOrganizer);
    }
    getRouter() {
        return this.router;
    }
}
exports.AuthoRouter = AuthoRouter;
