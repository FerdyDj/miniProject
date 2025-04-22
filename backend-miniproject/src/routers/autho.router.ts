import { Router } from "express";
import { validateRegister } from "../middleware/validation";
import { AuthMiddleware } from "../middleware/auth.middleware";
import { AuthoController } from "../controllers/autho.controller";

export class AuthoRouter {
  private router: Router;
  private authoController: AuthoController;
  private authMiddleware: AuthMiddleware;

  constructor() {
    this.router = Router();
    this.authoController = new AuthoController();
    this.authMiddleware = new AuthMiddleware();
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.post(
      "/",
      validateRegister,
      this.authoController.registerOrganizer
    );
    this.router.post("/login", this.authoController.loginOrganizer);
    this.router.patch(
      "/verifyo",
      this.authMiddleware.verifyTokenOrganizer,
      this.authoController.verifyOrganizer
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
