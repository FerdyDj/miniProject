"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_router_1 = require("./routers/auth.router");
const cors_1 = __importDefault(require("cors"));
const autho_router_1 = require("./routers/autho.router");
const reward_router_1 = require("./routers/reward.router");
const event_router_1 = require("./routers/event.router");
const path_1 = __importDefault(require("path"));
const organizer_router_1 = require("./routers/organizer.router");
const order_router_1 = require("./routers/order.router");
const ticket_router_1 = require("./routers/ticket.router");
const point_router_1 = require("./routers/point.router");
const discount_router_1 = require("./routers/discount.router");
const review_router_1 = require("./routers/review.router");
const dashboard_router_1 = require("./routers/dashboard.router");
const payment_router_1 = require("./routers/payment.router");
const PORT = 8000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/api", (req, res) => {
    res.status(200).send({
        status: "success",
        message: "Welcome to my API",
    });
});
app.use("/api/public", express_1.default.static(path_1.default.join(__dirname, "../public")));
const authRouter = new auth_router_1.AuthRouter();
app.use("/api/auth", authRouter.getRouter());
const authoRouter = new autho_router_1.AuthoRouter();
app.use("/api/autho", authoRouter.getRouter());
const rewardRouter = new reward_router_1.RewardRouter();
app.use("/api/rewards", rewardRouter.getRouter());
const eventRouter = new event_router_1.EventRouter();
app.use("/api/events", eventRouter.getRouter());
const organizerRouter = new organizer_router_1.OrganizerRouter();
app.use("/api/organizers", organizerRouter.getRouter());
const orderRouter = new order_router_1.OrderRouter();
app.use("/api/orders", orderRouter.getRouter());
const ticketRouter = new ticket_router_1.TicketRouter();
app.use("/api/tickets", ticketRouter.getRouter());
const pointRouter = new point_router_1.PointRouter();
app.use("/api/points", pointRouter.getRouter());
const discountRouter = new discount_router_1.DiscountRouter();
app.use("/api/discounts", discountRouter.getRouter());
const reviewRouter = new review_router_1.ReviewRouter();
app.use("/api/reviews", reviewRouter.getRouter());
const dashboardRouter = new dashboard_router_1.DashboardRouter();
app.use("/api/dashboard", dashboardRouter.getRouter());
const paymentRouter = new payment_router_1.PaymentRouter();
app.use("/api/payments", paymentRouter.getRouter());
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
