import express, { Application, Request, Response } from "express";
import { AuthRouter } from "./routers/auth.router";
import cors from "cors";
import { AuthoRouter } from "./routers/autho.router";
import { RewardRouter } from "./routers/reward.router";
import { EventRouter } from "./routers/event.router";
import path from "path";
import { OrganizerRouter } from "./routers/organizer.router";
import { OrderRouter } from "./routers/order.router";
import { TicketRouter } from "./routers/ticket.router";
import { PointRouter } from "./routers/point.router";
import { DiscountRouter } from "./routers/discount.router";
import { ReviewRouter } from "./routers/review.router";
import { DashboardRouter } from "./routers/dashboard.router";
import { PaymentRouter } from "./routers/payment.router";

const PORT: number = 8000;

const app: Application = express();
app.use(express.json());
app.use(cors({origin: process.env.URL_FE}));

app.get("/api", (req: Request, res: Response) => {
  res.status(200).send({
    status: "success",
    message: "Welcome to my API",
  });
});

app.use("/api/public", express.static(path.join(__dirname, "../public")));

const authRouter = new AuthRouter();
app.use("/api/auth", authRouter.getRouter());

const authoRouter = new AuthoRouter();
app.use("/api/autho", authoRouter.getRouter());

const rewardRouter = new RewardRouter();
app.use("/api/rewards", rewardRouter.getRouter());

const eventRouter = new EventRouter();
app.use("/api/events", eventRouter.getRouter());

const organizerRouter = new OrganizerRouter();
app.use("/api/organizers", organizerRouter.getRouter());

const orderRouter = new OrderRouter();
app.use("/api/orders", orderRouter.getRouter());

const ticketRouter = new TicketRouter();
app.use("/api/tickets", ticketRouter.getRouter());

const pointRouter = new PointRouter();
app.use("/api/points", pointRouter.getRouter());

const discountRouter = new DiscountRouter();
app.use("/api/discounts", discountRouter.getRouter());

const reviewRouter = new ReviewRouter();
app.use("/api/reviews", reviewRouter.getRouter());

const dashboardRouter = new DashboardRouter();
app.use("/api/dashboard", dashboardRouter.getRouter());

const paymentRouter = new PaymentRouter();
app.use("/api/payments", paymentRouter.getRouter());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
