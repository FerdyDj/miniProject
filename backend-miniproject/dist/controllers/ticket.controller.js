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
exports.TicketController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class TicketController {
    createTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: organizerId, role } = req.organizer;
                if (!organizerId || role !== "ORGANIZER")
                    throw { message: "Unauthorized!" };
                const { eventId } = req.params;
                const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
                if (!event)
                    throw { message: "Event not found!" };
                const { category, price, quantity } = req.body;
                yield prisma_1.default.ticket.create({
                    data: {
                        category,
                        price,
                        quantity,
                        eventId,
                    },
                });
                res.status(201).send({
                    message: "Ticket Created ✅",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTicket(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: organizerId, role } = req.organizer;
                if (!organizerId || role !== "ORGANIZER")
                    throw { message: "Unauthorized!" };
                const { eventId } = req.params;
                const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
                if (!event)
                    throw { message: "Event not found!" };
                const tickets = yield prisma_1.default.ticket.findMany({
                    where: { eventId },
                    include: { event: true },
                });
                res.status(200).send({
                    message: "Data tickets",
                    tickets,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getTicketByEventId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
                if (!event)
                    throw { message: "Event not found!" };
                const tickets = yield prisma_1.default.ticket.findMany({
                    where: { eventId: event.id },
                });
                res.status(200).send({
                    message: "Event detail",
                    tickets,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.TicketController = TicketController;
