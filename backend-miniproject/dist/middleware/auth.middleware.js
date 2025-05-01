"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthMiddleware {
    verifyToken(req, res, next) {
        var _a;
        try {
            const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!token)
                throw { message: "Unauthorized!" };
            const verifiedCustomer = (0, jsonwebtoken_1.verify)(token, process.env.KEY_JWT);
            req.customer = verifiedCustomer;
            next();
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
    verifyTokenOrganizer(req, res, next) {
        var _a;
        try {
            const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
            if (!token)
                throw { message: "Unauthorized!" };
            const verifiedOrganizer = (0, jsonwebtoken_1.verify)(token, process.env.KEY_JWT);
            req.organizer = verifiedOrganizer;
            next();
        }
        catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
}
exports.AuthMiddleware = AuthMiddleware;
