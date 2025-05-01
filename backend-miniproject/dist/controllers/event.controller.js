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
exports.EventController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const cloudinary_1 = require("../helpers/cloudinary");
class EventController {
    createEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                if (!req.file)
                    throw { message: "Image Empty!" };
                const { title, category, eventDate, startTime, endTime, location, venue, description, } = req.body;
                const { secure_url } = yield (0, cloudinary_1.cloudinaryUpload)(req.file, "HoopPass");
                yield prisma_1.default.event.create({
                    data: {
                        image: secure_url,
                        title,
                        category,
                        eventDate: new Date(eventDate),
                        startTime,
                        endTime,
                        location,
                        venue,
                        description,
                        organizerId: (_a = req.organizer) === null || _a === void 0 ? void 0 : _a.id,
                    },
                });
                res.status(201).send({
                    message: "Event Created ✅",
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEvent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield prisma_1.default.event.findMany({
                    select: {
                        id: true,
                        image: true,
                        title: true,
                        category: true,
                        eventDate: true,
                        startTime: true,
                        endTime: true,
                        location: true,
                        venue: true,
                        description: true,
                        organizer: {
                            select: {
                                fullname: true,
                                avatar: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                });
                res.status(200).send({
                    message: "Data events",
                    data: events,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const events = yield prisma_1.default.event.findUnique({ where: { id: id } });
                if (!events)
                    throw { message: "Event not found!" };
                res.status(200).send({
                    message: "Event detail",
                    events,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    getEventByOrganizerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: organizerId, role } = req.organizer;
                if (!organizerId || role !== "ORGANIZER")
                    throw { message: "Unauthorized!" };
                const events = yield prisma_1.default.event.findMany({ where: { organizerId } });
                res.status(200).send({ data: events });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.EventController = EventController;
