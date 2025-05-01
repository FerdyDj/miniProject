"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const ticket_controller_1 = require("../controllers/ticket.controller");
class TicketRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.ticketController = new ticket_controller_1.TicketController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.InitialiazeRoute();
    }
    InitialiazeRoute() {
        this.router.get("/:eventId", this.ticketController.getTicketByEventId);
        this.router.get("/:eventId", this.authMiddleware.verifyTokenOrganizer, this.ticketController.getTicket);
        this.router.post("/:eventId", this.authMiddleware.verifyTokenOrganizer, this.ticketController.createTicket);
    }
    getRouter() {
        return this.router;
    }
}
exports.TicketRouter = TicketRouter;
