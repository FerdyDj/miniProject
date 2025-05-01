"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const luxon_1 = require("luxon");
class DashboardController {
    constructor() {
        this.getDashboardSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [totalEvents, totalOrders, profitAgg, ticketAgg] = yield Promise.all([
                    prisma_1.default.event.count(),
                    prisma_1.default.order.count({ where: { status: "PAID" } }),
                    prisma_1.default.order.aggregate({
                        _sum: { amount: true },
                        where: { status: "PAID" },
                    }),
                    prisma_1.default.order.aggregate({
                        _sum: { qty: true },
                        where: { status: "PAID" },
                    }),
                ]);
                res.json({
                    totalEvents,
                    totalOrders,
                    totalProfit: profitAgg._sum.amount || 0,
                    totalTickets: ticketAgg._sum.qty || 0,
                });
            }
            catch (err) {
                res.status(500).json({ message: "Failed to get dashboard summary", err });
            }
        });
    }
    getEventChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.countByMonth("event");
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Failed to get event chart", err });
            }
        });
    }
    getTransactionChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.countByDay("order", "PAID");
                res.json(data);
            }
            catch (err) {
                res.status(500).json({ message: "Failed to get transaction chart", err });
            }
        });
    }
    getTicketChart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentYear = new Date().getFullYear();
                const result = yield Promise.all([currentYear - 1, currentYear].map((year) => __awaiter(this, void 0, void 0, function* () {
                    const start = new Date(year, 0, 1);
                    const end = new Date(year, 11, 31, 23, 59, 59);
                    const agg = yield prisma_1.default.order.aggregate({
                        _sum: { qty: true },
                        where: { createdAt: { gte: start, lte: end }, status: "PAID" },
                    });
                    return { year, total: agg._sum.qty || 0 };
                })));
                res.json(result);
            }
            catch (err) {
                res.status(500).json({ message: "Failed to get ticket chart", err });
            }
        });
    }
    // Helpers
    countByMonth(model, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = luxon_1.DateTime.now().setZone("Asia/Jakarta");
            const year = now.year;
            const results = [];
            for (let i = 0; i < 12; i++) {
                const month = i + 1;
                const start = luxon_1.DateTime.fromObject({ year, month, day: 1 }, { zone: "Asia/Jakarta" }).startOf('day').toUTC();
                const end = luxon_1.DateTime.fromObject({ year, month }, { zone: "Asia/Jakarta" }).endOf('month').toUTC();
                const where = {
                    createdAt: {
                        gte: start.toJSDate(),
                        lte: end.toJSDate(),
                    },
                };
                if (status)
                    where.status = status;
                const count = yield prisma_1.default[model].count({ where });
                results.push({
                    name: start.setZone('Asia/Jakarta').toFormat('LLLL'), // Nama bulan: "Mei"
                    total: count,
                });
            }
            return results;
        });
    }
    countByDay(model, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = luxon_1.DateTime.now().setZone("Asia/Jakarta");
            const results = [];
            for (let i = 6; i >= 0; i--) {
                const current = now.minus({ days: i });
                const start = current.startOf("day").toUTC();
                const end = current.endOf("day").toUTC();
                const where = {
                    createdAt: {
                        gte: start.toJSDate(),
                        lte: end.toJSDate(),
                    },
                };
                if (status)
                    where.status = status;
                const count = yield prisma_1.default[model].count({ where });
                results.push({
                    name: current.toFormat("yyyy-MM-dd"), // Misalnya "2025-05-01"
                    total: count,
                });
            }
            return results;
        });
    }
}
exports.DashboardController = DashboardController;
