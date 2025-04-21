import { Router } from "express";
import { CustomerController } from "../controllers/customer.controller";

export class CustomerRouter {
    private router: Router;
    private customerController: CustomerController;

    constructor() {
        this.router = Router();
        this.customerController = new CustomerController();

    }

    private initializedRoute() {

    }

    getRouter(): Router {
        return this.router;
    }
}