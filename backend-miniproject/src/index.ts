import express, { Application, Request, Response } from "express";
import { AuthRouter } from "./routers/auth.router";
import cors from "cors";
import { AuthoRouter } from "./routers/autho.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({
    status: "success",
    message: "Welcome to my API",
  });
});

const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

const authoRouter = new AuthoRouter();
app.use("/api/autho", authoRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
