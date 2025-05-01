"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRouter = void 0;
const express_1 = require("express");
const event_controller_1 = require("../controllers/event.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const uploader_1 = require("../helpers/uploader");
class EventRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.eventController = new event_controller_1.EventController();
        this.authMiddleware = new auth_middleware_1.AuthMiddleware();
        this.InitialiazeRoute();
    }
    InitialiazeRoute() {
        this.router.get("/", this.eventController.getEvent);
        this.router.get("/:id", this.eventController.getEventById);
        this.router.get("/organizer/:organizerId", this.authMiddleware.verifyTokenOrganizer, this.eventController.getEventByOrganizerId);
        this.router.post("/cloud", (0, uploader_1.uploader)("memoryStorage", "hp-").single("image"), this.authMiddleware.verifyTokenOrganizer, this.eventController.createEvent);
    }
    getRouter() {
        return this.router;
    }
}
exports.EventRouter = EventRouter;
