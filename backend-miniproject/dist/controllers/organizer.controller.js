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
exports.OrganizerController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class OrganizerController {
    getOrganizerId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const organizer = yield prisma_1.default.organizer.findUnique({
                    where: { id: +id },
                    select: {
                        id: true,
                        fullname: true,
                        avatar: true,
                    },
                });
                if (!organizer)
                    throw { message: "Organizer not found!" };
                res.status(200).send(organizer);
            }
            catch (err) {
                console.error(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.OrganizerController = OrganizerController;
