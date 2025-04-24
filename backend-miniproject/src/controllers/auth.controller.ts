import { Request, Response } from "express";
import prisma from "../prisma";
import referralCode from "referral-codes";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "../helpers/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthController {
  async registerCustomer(req: Request, res: Response) {
    try {
      const { fullname, username, email, password, refBy } = req.body;

      const validateRefBy = refBy
        ? await prisma.customer.findUnique({ where: { refCode: refBy } })
        : null;

      if (refBy && !validateRefBy) {
        res.status(400).send({ message: "Invalid referral code!" });
        return;
      }

      const refCode = referralCode
        .generate({
          length: 7,
          count: 1,
        })
        .toString();

      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      const customer = await prisma.customer.create({
        data: {
          fullname,
          username,
          email,
          password: hashedPass,
          refCode,
          refBy: refBy || null,
        },
      });

      console.log(refBy);

      const payload = { id: customer.id, role: customer.role };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: "1d" });
      const link = `${process.env.URL_FE}/verify/${token}`;

      const templatePath = path.join(__dirname, "../templates", `verify.hbs`);
      const templateSource = fs.readFileSync(templatePath, "utf-8");
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({ username, link });

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Please Verify Your Email Address",
        html,
      });

      res.status(201).send({ message: "Registered ✅ Verify Your Email!" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async loginCustomer(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const customer = await prisma.customer.findUnique({ where: { email } });
      if (!customer) throw { message: "User not found!" };
      if (!customer.isVerified) throw { message: "Account not verified!" };

      const isValidPass = await compare(password, customer.password);
      if (!isValidPass) throw { message: "Incorrect password!" };

      const payload = { id: customer.id, role: customer.role };
      const access_token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1d",
      });

      res.status(200).send({
        message: "Login successfully ✅",
        data: customer,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const customer = await prisma.customer.update({
        data: { isVerified: true },
        where: { id: req.customer?.id },
      });

      if (customer.refBy) {
        const referrer = await prisma.customer.findUnique({
          where: { refCode: customer.refBy },
        });

        if (referrer) {
          await prisma.point.create({
            data: {
              customerId: referrer.id,
              amount: 10000,
              expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            },
          });
        }

        await prisma.discount.create({
          data: {
            customerId: customer.id,
            code: `REF-${referrer?.refCode}`,
            percen: 10,
            expiredAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });
      }

      res.status(200).send({ message: "Verification Success!" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
