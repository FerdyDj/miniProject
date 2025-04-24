import { Request, Response } from "express";
import prisma from "../prisma";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { transporter } from "../helpers/mailer";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

export class AuthoController {
  async registerOrganizer(req: Request, res: Response) {
    try {
      const { fullname, username, email, password } = req.body;

      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      const organizer = await prisma.organizer.create({
        data: { fullname, username, email, password: hashedPass },
      });

      const payload = { id: organizer.id, role: organizer.role };
      const token = sign(payload, process.env.KEY_JWT!, { expiresIn: "1d" });
      const link = `${process.env.URL_FE}/verifyo/${token}`;

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

  async loginOrganizer(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const organizer = await prisma.organizer.findUnique({ where: { email } });
      if (!organizer) throw { message: "User not found!" };
      if (!organizer.isVerified) throw { message: "Account not verified!" };

      const isValidPass = await compare(password, organizer.password);
      if (!isValidPass) throw { message: "Incorrect password!" };

      const payload = { id: organizer.id, role: organizer.role };
      const access_token = sign(payload, process.env.KEY_JWT!, {
        expiresIn: "1d",
      });

      res.status(200).send({
        message: "Login successfully ✅",
        data: organizer,
        access_token,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async verifyOrganizer(req: Request, res: Response) {
    try {
      await prisma.organizer.update({
        data: { isVerified: true },
        where: { id: req.organizer?.id },
      });

      res.status(200).send({ message: "Verification Success!" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
