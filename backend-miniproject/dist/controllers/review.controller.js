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
exports.ReviewController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ReviewController {
    getReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { eventId } = req.params;
                const reviews = yield prisma_1.default.review.findMany({
                    where: { eventId },
                    include: {
                        customer: { select: { id: true, avatar: true, fullname: true } },
                    },
                    orderBy: { createdAt: "desc" },
                });
                res.status(200).send({ reviews });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    postReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: customerId, role } = req.customer;
                if (!customerId || role !== "CUSTOMER")
                    throw { message: "Unauthorized!" };
                const { eventId } = req.params;
                const event = yield prisma_1.default.event.findUnique({ where: { id: eventId } });
                if (!event)
                    throw { message: "Event not found!" };
                const { rating, comment } = req.body;
                yield prisma_1.default.review.create({
                    data: { eventId, customerId, rating, comment: comment || null },
                });
                res.status(201).send({ message: "Review Created ✅" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.ReviewController = ReviewController;
