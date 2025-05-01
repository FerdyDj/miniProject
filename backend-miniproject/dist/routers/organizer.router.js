"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizerRouter = void 0;
const express_1 = require("express");
const organizer_controller_1 = require("../controllers/organizer.controller");
class OrganizerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.organizerController = new organizer_controller_1.OrganizerController();
        this.InitializeRoute();
    }
    InitializeRoute() {
        this.router.get("/:id", this.organizerController.getOrganizerId);
    }
    getRouter() {
        return this.router;
    }
}
exports.OrganizerRouter = OrganizerRouter;
