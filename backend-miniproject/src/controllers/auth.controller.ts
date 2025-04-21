import { Request, Response } from "express";
import prisma from "../prisma";
import referralCode from "referral-codes";
import { compare, genSalt, hash } from "bcrypt";
import { sign } from "jsonwebtoken";

export class AuthController {
  async registerCustomer(req: Request, res: Response) {
    try {
      const { fullname, username, email, password } = req.body;
      const refCode = referralCode
        .generate({
          length: 7,
          count: 1,
        })
        .toString();

      const salt = await genSalt(10);
      const hashedPass = await hash(password, salt);

      await prisma.customer.create({
        data: { fullname, username, email, password: hashedPass, refCode },
      });
      res.status(201).send({ message: "Customer created ✅" });
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

      const isValidPass = await compare(password, customer.password)
      if (!isValidPass) throw { message: "Incorrect password!" };

      const payload = { id: customer.id, role: "customer" };
      const access_token = sign(payload, process.env.KEY_JWT!, { expiresIn: "10m" })

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
}
