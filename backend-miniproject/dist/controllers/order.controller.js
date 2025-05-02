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
exports.OrderController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const xendit_1 = __importDefault(require("../helpers/xendit"));
const client_1 = require("../../prisma/generated/client");
class OrderController {
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { tickets, usePoint, useVoucher } = req.body;
                const customerId = (_a = req.customer) === null || _a === void 0 ? void 0 : _a.id;
                const customer = yield prisma_1.default.customer.findUnique({
                    where: { id: customerId },
                });
                if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
                    res.status(400).send({ message: "No tickets selected" });
                    return;
                }
                yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    let totalAmount = 0;
                    const order = yield Promise.all(tickets.map((item) => __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const ticket = yield tx.ticket.findUnique({
                            where: { id: item.ticketId },
                        });
                        if (!ticket)
                            throw { message: "Ticket not found!" };
                        if (ticket.quantity < item.quantity)
                            throw { message: "Not enough ticket stock!" };
                        yield tx.ticket.update({
                            where: { id: item.ticketId },
                            data: { quantity: { decrement: item.quantity } },
                        });
                        totalAmount += ticket.price * item.quantity;
                        return tx.order.create({
                            data: {
                                ticketId: item.ticketId,
                                qty: item.quantity,
                                amount: ticket.price * item.quantity,
                                status: "PENDING",
                                expiredAt: new Date(Date.now() + 60 * 60 * 1000),
                                customerId: (_a = req.customer) === null || _a === void 0 ? void 0 : _a.id,
                            },
                        });
                    })));
                    if (usePoint) {
                        const point = yield tx.point.findFirst({ where: { customerId } });
                        if (point) {
                            totalAmount = Math.max(0, totalAmount - point.amount);
                            yield tx.point.delete({ where: { id: point.id } }); // use all point once
                        }
                    }
                    else if (useVoucher) {
                        const discount = yield tx.discount.findFirst({
                            where: { customerId, used: false },
                        });
                        if (discount) {
                            totalAmount = totalAmount - (totalAmount * discount.percen) / 100;
                            yield tx.discount.update({
                                where: { id: discount.id },
                                data: { used: true },
                            });
                        }
                    }
                    const data = {
                        amount: Math.floor(totalAmount),
                        invoiceDuration: "3600",
                        externalId: order[0].id,
                        description: `Invoice order with Id ${customerId}`,
                        currency: "IDR",
                        reminderTime: 1,
                        successRedirectUrl: `https://hooppass.vercel.app/api/profile/${customer === null || customer === void 0 ? void 0 : customer.username}/ticket`,
                    };
                    const invoice = yield xendit_1.default.Invoice.createInvoice({ data });
                    yield tx.order.updateMany({
                        where: { customerId, status: "PENDING" },
                        data: { invoiceUrl: invoice.invoiceUrl },
                    });
                    res.status(201).send({ message: "Order Created ✅ Redirect to Payment Page", invoice });
                }));
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, external_id } = req.body;
                if (status == client_1.StatusOrder.PAID) {
                    yield prisma_1.default.order.update({
                        data: { status: "PAID" },
                        where: { id: external_id },
                    });
                }
                else if (status == client_1.StatusOrder.EXPIRED) {
                    yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        yield tx.order.update({
                            data: { status: "EXPIRED" },
                            where: { id: external_id },
                        });
                        const order = yield tx.order.findUnique({
                            where: { id: external_id },
                        });
                        yield tx.ticket.update({
                            data: { quantity: { increment: order === null || order === void 0 ? void 0 : order.qty } },
                            where: { id: order === null || order === void 0 ? void 0 : order.ticketId },
                        });
                    }));
                }
                res.status(200).send({ message: "Success ✅" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getOrderByCustomerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: customerId, role } = req.customer;
                if (!customerId || role !== "CUSTOMER")
                    throw { message: "Unauthorized!" };
                const orders = yield prisma_1.default.order.findMany({
                    where: { customerId: Number(customerId), status: "PAID" }, // Ensure customerId is converted to a number
                    include: {
                        ticket: {
                            include: {
                                event: true, // Include related event details
                            },
                        },
                    },
                    orderBy: { ticket: { event: { eventDate: "asc" } } }
                });
                res.status(200).send({
                    message: "Ticket detail",
                    orders,
                    // customerTickets,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.OrderController = OrderController;
