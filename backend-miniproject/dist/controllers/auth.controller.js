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
exports.AuthController = void 0;
const prisma_1 = __importDefault(require("../prisma"));
const referral_codes_1 = __importDefault(require("referral-codes"));
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const mailer_1 = require("../helpers/mailer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const handlebars_1 = __importDefault(require("handlebars"));
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
                const refCode = referral_codes_1.default
                    .generate({
                    length: 7,
                    count: 1,
                })
                    .toString();
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
