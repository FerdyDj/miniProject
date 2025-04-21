import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { validateRegister } from "../middleware/validation";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.post("/", validateRegister, this.authController.registerCustomer);
    this.router.post("/login", this.authController.loginCustomer);
  }

  getRouter(): Router {
    return this.router;
  }
}
