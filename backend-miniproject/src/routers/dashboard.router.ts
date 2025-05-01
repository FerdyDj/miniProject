import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";

export class DashboardRouter {
  private router: Router;
  private controller: DashboardController;

  constructor() {
    this.router = Router();
    this.controller = new DashboardController();
    this.routes();
  }

  private routes() {
    this.router.get("/summary", this.controller.getDashboardSummary.bind(this.controller));
    this.router.get("/events-per-month", this.controller.getEventChart.bind(this.controller));
    this.router.get("/transactions-per-day", this.controller.getTransactionChart.bind(this.controller));
    this.router.get("/tickets-per-year", this.controller.getTicketChart.bind(this.controller));
  }

  public getRouter(): Router {
    return this.router;
  }
}