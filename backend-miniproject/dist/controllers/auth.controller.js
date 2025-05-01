"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../helpers/mailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
let referralCodeModule;
(() => __awaiter(void 0, void 0, void 0, function* () {
    referralCodeModule = yield Promise.resolve().then(() => __importStar(require("referral-codes")));
}))();
class AuthController {
    registerCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullname, username, email, password, refBy } = req.body;
                const validateRefBy = refBy
                    ? yield prisma_1.default.customer.findUnique({ where: { refCode: refBy } })
                    : null;
                if (refBy && !validateRefBy) {
                    res.status(400).send({ message: "Invalid referral code!" });
                    return;
                }
                const refCode = referralCodeModule.default
                    .generate({
                    length: 7,
                    count: 1,
                })[0];
                const salt = yield (0, bcrypt_1.genSalt)(10);
                const hashedPass = yield (0, bcrypt_1.hash)(password, salt);
                const customer = yield prisma_1.default.customer.create({
                    data: {
                        fullname,
                        username,
                        email,
                        password: hashedPass,
                        refCode,
                        refBy: refBy || null,
                    },
                });
                const payload = { id: customer.id, role: customer.role };
                const token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, { expiresIn: "1d" });
                const link = `${process.env.URL_FE}/verify/${token}`;
                const templatePath = path_1.default.join(__dirname, "../templates", `verify.hbs`);
                const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
                const compiledTemplate = handlebars_1.default.compile(templateSource);
                const html = compiledTemplate({ username, link });
                yield mailer_1.transporter.sendMail({
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: "Please Verify Your Email Address",
                    html,
                });
                res.status(201).send({ message: "Registered ✅ Verify Your Email!" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    loginCustomer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const customer = yield prisma_1.default.customer.findUnique({ where: { email } });
                if (!customer)
                    throw { message: "User not found!" };
                if (!customer.isVerified)
                    throw { message: "Account not verified!" };
                const isValidPass = yield (0, bcrypt_1.compare)(password, customer.password);
                if (!isValidPass)
                    throw { message: "Incorrect password!" };
                const payload = { id: customer.id, role: customer.role };
                const access_token = (0, jsonwebtoken_1.sign)(payload, process.env.KEY_JWT, {
                    expiresIn: "1d",
                });
                res.status(200).send({
                    message: "Login successfully ✅",
                    data: customer,
                    access_token,
                });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
    verify(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const customer = yield prisma_1.default.customer.update({
                    data: { isVerified: true },
                    where: { id: (_a = req.customer) === null || _a === void 0 ? void 0 : _a.id },
                });
                if (customer.refBy) {
                    const referrer = yield prisma_1.default.customer.findUnique({
                        where: { refCode: customer.refBy },
                    });
                    if (referrer) {
                        yield prisma_1.default.point.create({
                            data: {
                                customerId: referrer.id,
                                amount: 10000,
                                expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                            },
                        });
                    }
                    yield prisma_1.default.discount.create({
                        data: {
                            customerId: customer.id,
                            code: `REF-${referrer === null || referrer === void 0 ? void 0 : referrer.refCode}`,
                            percen: 10,
                            expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
                        },
                    });
                }
                res.status(200).send({ message: "Verification Success!" });
            }
            catch (err) {
                console.log(err);
                res.status(400).send(err);
            }
        });
    }
}
exports.AuthController = AuthController;
