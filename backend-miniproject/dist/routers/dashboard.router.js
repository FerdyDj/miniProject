"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRouter = void 0;
const express_1 = require("express");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
class DashboardRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.controller = new dashboard_controller_1.DashboardController();
        this.routes();
    }
    routes() {
        this.router.get("/summary", this.controller.getDashboardSummary.bind(this.controller));
        this.router.get("/events-per-month", this.controller.getEventChart.bind(this.controller));
        this.router.get("/transactions-per-day", this.controller.getTransactionChart.bind(this.controller));
        this.router.get("/tickets-per-year", this.controller.getTicketChart.bind(this.controller));
    }
    getRouter() {
        return this.router;
    }
}
exports.DashboardRouter = DashboardRouter;
