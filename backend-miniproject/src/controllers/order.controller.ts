import { Request, Response } from "express";
import prisma from "../prisma";
import xendit from "../helpers/xendit";
import { CreateInvoiceRequest } from "xendit-node/invoice/models";
import { StatusOrder } from "../../prisma/generated/client";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    try {
      const { tickets, usePoint, useVoucher } = req.body;
      const customerId = req.customer?.id;

      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
      });

      if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
        res.status(400).send({ message: "No tickets selected" });
        return;
      }

      await prisma.$transaction(async (tx) => {
        let totalAmount = 0;

        const order = await Promise.all(
          tickets.map(async (item: { ticketId: string; quantity: number }) => {
            const ticket = await tx.ticket.findUnique({
              where: { id: item.ticketId },
            });

            if (!ticket) throw { message: "Ticket not found!" };
            if (ticket.quantity < item.quantity)
              throw { message: "Not enough ticket stock!" };

            await tx.ticket.update({
              where: { id: item.ticketId },
              data: { quantity: { decrement: item.quantity } },
            });

            totalAmount += ticket.price * item.quantity;

            return tx.order.create({
              data: {
                ticketId: item.ticketId,
                qty: item.quantity,
                amount: ticket.price * item.quantity,
                status: "PENDING",
                expiredAt: new Date(Date.now() + 60 * 60 * 1000),
                customerId: req.customer?.id!,
              },
            });
          })
        );

        if (usePoint) {
          const point = await tx.point.findFirst({ where: { customerId } });
          if (point) {
            totalAmount = Math.max(0, totalAmount - point.amount);
            await tx.point.delete({ where: { id: point.id } }); // use all point once
          }
        } else if (useVoucher) {
          const discount = await tx.discount.findFirst({
            where: { customerId, used: false },
          });
          if (discount) {
            totalAmount = totalAmount - (totalAmount * discount.percen) / 100;
            await tx.discount.update({
              where: { id: discount.id },
              data: { used: true },
            });
          }
        }

        const data: CreateInvoiceRequest = {
          amount: Math.floor(totalAmount),
          invoiceDuration: "3600",
          externalId: order[0].id,
          description: `Invoice order with Id ${customerId}`,
          currency: "IDR",
          reminderTime: 1,
          successRedirectUrl: `http://localhost:3000/profile/${customer?.username}/ticket`,
        };

        const invoice = await xendit.Invoice.createInvoice({ data });

        await tx.order.updateMany({
          where: { customerId, status: "PENDING" },
          data: { invoiceUrl: invoice.invoiceUrl },
        });

        res.status(201).send({ message: "Order Created ✅ Redirect to Payment Page", invoice });
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async updateStatus(req: Request, res: Response) {
    try {
      const { status, external_id } = req.body;

      if (status == StatusOrder.PAID) {
        await prisma.order.update({
          data: { status: "PAID" },
          where: { id: external_id },
        });
      } else if (status == StatusOrder.EXPIRED) {
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            data: { status: "EXPIRED" },
            where: { id: external_id },
          });

          const order = await tx.order.findUnique({
            where: { id: external_id },
          });

          await tx.ticket.update({
            data: { quantity: { increment: order?.qty } },
            where: { id: order?.ticketId },
          });
        });
      }

      res.status(200).send({ message: "Success ✅" });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }

  async getOrderByCustomerId(req: Request, res: Response) {
    try {
      const { id: customerId, role } = req.customer!;

      if (!customerId || role !== "CUSTOMER")
        throw { message: "Unauthorized!" };

      const orders = await prisma.order.findMany({
        where: { customerId: Number(customerId), status: "PAID" }, // Ensure customerId is converted to a number
        include: {
          ticket: {
            include: {
              event: true, // Include related event details
            },
          },
        },
        orderBy: { ticket: { event : { eventDate: "asc"}}}
      });  

      res.status(200).send({
        message: "Ticket detail",
        orders,
        // customerTickets,
      });
    } catch (err) {
      console.log(err);
      res.status(400).send(err);
    }
  }
}
