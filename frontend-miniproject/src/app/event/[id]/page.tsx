"use client";

import { useState, useEffect, use } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useSession } from "next-auth/react";

interface IEvent {
  id: string;
  title: string;
  image: string;
  eventDate: string;
  category: string;
  description: string;
  location: string;
  startTime: string;
  endTime: string;
  venue: string;
}

interface ITicket {
  id: string;
  category: string;
  price: number;
  quantity: string;
}

interface IPoint {
  amount: number;
}

interface IDiscount {
  id: number;
  code: string;
  percen: number;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [ticket, setTicket] = useState<ITicket[]>([]);
  const [activeTab, setActiveTab] = useState<"description" | "ticket">(
    "description"
  );
  const [selectedTickets, setSelectedTickets] = useState<
    {
      id: string;
      category: string;
      price: number;
      quantity: number;
    }[]
  >([]);
  const [points, setPoints] = useState<IPoint | null>(null);
  const [discount, setDiscount] = useState<IDiscount | null>(null);
  const [usePoint, setUsePoint] = useState<boolean>(false);
  const [useVoucher, setUseVoucher] = useState<boolean>(false);

  const { data: session, status } = useSession();
  const { id } = use(params);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/events/${id}`);
        setEvent(response.data.events);
        const res = await axios.get(`/tickets/${id}`);
        setTicket(res.data.tickets);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
  }, []);

  useEffect(() => {
    const fetchReward = async () => {
      if (session?.user.role === "CUSTOMER") {
        const pointRes = await axios.get(`/points/${session?.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setPoints(pointRes.data.stat._sum || null);
        const discountRes = await axios.get(`/discounts/${session?.user.id}`, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        setDiscount(discountRes.data.discount || null);
      }
    };
    fetchReward();
  }, [id, session]);

  const handleSelectTicket = (ticket: ITicket) => {
    setSelectedTickets((prevSelected) => {
      const exist = prevSelected.find((t) => t.id === ticket.id);
      if (exist) {
        // if ticket already selected, increase quantity
        return prevSelected.map((t) =>
          t.id === ticket.id ? { ...t, quantity: t.quantity + 1 } : t
        );
      } else {
        // if ticket not selected, add it
        return [...prevSelected, { ...ticket, quantity: 1 }];
      }
    });
  };

  const handleChangeQuantity = (ticketId: string, delta: number) => {
    setSelectedTickets(
      (prev) =>
        prev
          .map((ticket) =>
            ticket.id === ticketId
              ? { ...ticket, quantity: ticket.quantity + delta }
              : ticket
          )
          .filter((ticket) => ticket.quantity > 0) // remove if quantity goes to 0
    );
  };

  const totalTickets = selectedTickets.reduce(
    (sum, ticket) => sum + ticket.quantity * ticket.price,
    0
  );

  let totalPrice = totalTickets;

  if (usePoint && points) {
    totalPrice = totalPrice - points.amount;
  } else if (useVoucher && discount) {
    totalPrice = totalPrice - (totalPrice * discount.percen) / 100;
  }

  const handleOrder = async () => {
    if (selectedTickets.length === 0) return;
    try {
      const payload = {
        tickets: selectedTickets.map((ticket) => ({
          ticketId: ticket.id,
          quantity: ticket.quantity,
        })),
        usePoint,
        useVoucher,
      };
      const response = await axios.post(`/orders/status`, payload);
      window.location.href = response.data.invoice.invoiceUrl;
    } catch (error) {
      console.error(error);
      alert("Order failed ❌");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Side */}
      <div className="md:col-span-2 space-y-8">
        {/* Event Image */}
        <div className="w-full overflow-hidden mt-12 rounded-lg">
          <Image
            src={
              event?.image ||
              "https://images.template.net/114549/free-basketball-poster-background-edit-online.jpg"
            }
            alt={`${event?.title}`}
            width={1200}
            height={600}
            className="object-cover w-full h-auto"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              className={`py-4 text-sm font-semibold ${
                activeTab === "description"
                  ? "text-white border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white hover:border-b-2 hover:border-white"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`py-4 text-sm font-semibold ${
                activeTab === "ticket"
                  ? "text-white border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-white hover:border-b-2 hover:border-white"
              }`}
              onClick={() => setActiveTab("ticket")}
            >
              Ticket
            </button>
          </nav>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6 text-gray-300">
          {activeTab === "description" && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Description
                </h2>
                <p className="leading-relaxed">{event?.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Terms and Conditions
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    Tickets are only available through the official platform.
                  </li>
                  <li>
                    Tickets are non-refundable unless the event is canceled.
                  </li>
                  <li>
                    Please bring a valid ID and proof of purchase to the event.
                  </li>
                </ul>
              </div>
            </>
          )}

          {activeTab === "ticket" && session?.user.role === "CUSTOMER" ? (
            <div className="mt-2 text-gray-800 text-shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-white">Tickets</h2>
              {ticket?.length === 0 ? (
                <p className="text-white">
                  No tickets available for this event yet.
                </p>
              ) : (
                <div className="flex flex-col w-full">
                  {ticket?.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => handleSelectTicket(ticket)}
                      className="border bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-md p-4 shadow-sm hover:shadow-md transition mb-4 cursor-pointer"
                    >
                      <h3 className="font-bold text-lg">{ticket?.category}</h3>
                      <p className="">
                        Price: IDR {ticket?.price.toLocaleString()}
                      </p>
                      <p className="">Stock: {ticket?.quantity}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-white font-semibold text-lg">
              To buy ticket please login first as a customer
            </p>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-gray-800 rounded-2xl mt-12 p-6 space-y-6 shadow-lg h-fit sticky top-20">
        {/* Event Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-orange-400">
            {event?.category} Match
          </p>
          <h1 className="text-2xl font-bold text-white">{event?.title}</h1>
        </div>
        {/* Event Details */}
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <span className="font-semibold text-white">Date:</span>{" "}
            {event?.eventDate
              ? new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date not available"}
          </p>
          <p>
            <span className="font-semibold text-white">Time:</span>{" "}
            {event?.startTime} - {event?.endTime}
          </p>
          <p>
            <span className="font-semibold text-white">Location:</span>{" "}
            {event?.venue}, {event?.location}
          </p>
        </div>
        {/* Share Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-300">Share Match</span>
          <div className="flex items-center space-x-4 text-white">
            <button className="hover:scale-110 transition">🔗</button>
            <button className="hover:scale-110 transition">📩</button>
            <button className="hover:scale-110 transition">🟢</button>
          </div>
        </div>
        {/* Ticket Section */}
        {session?.user.role === "CUSTOMER" && (
          <>
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <div className="flex justify-between items-center text-white font-bold">
                {selectedTickets.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTickets.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-white gap-3"
                      >
                        <div>
                          <h4 className="font-semibold">{item.category}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => handleChangeQuantity(item.id, -1)}
                              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => handleChangeQuantity(item.id, 1)}
                              className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <p className="pt-7">
                          IDR {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    Select tickets to order
                  </p>
                )}
              </div>
            </div>

            {/* Discounts */}
            {points || discount ? (
              <div className="mt-6 space-y-4">
                {points && (
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">
                      Use Points (IDR {points.amount})
                    </label>
                    <input
                      type="checkbox"
                      checked={usePoint}
                      disabled={useVoucher}
                      onChange={(e) => {
                        setUsePoint(e.target.checked);
                        if (e.target.checked) setUseVoucher(false);
                      }}
                    />
                  </div>
                )}
                {discount && (
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">
                      Use Voucher ({discount.percen}%)
                    </label>
                    <input
                      type="checkbox"
                      checked={useVoucher}
                      disabled={usePoint}
                      onChange={(e) => {
                        setUseVoucher(e.target.checked);
                        if (e.target.checked) setUsePoint(false);
                      }}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {/* Total Section */}
            <div className="border-t border-orange-300 pt-4">
              <div className="flex justify-between text-white font-bold">
                <span>Total:</span>
                <span>IDR {Math.floor(totalPrice).toLocaleString()}</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={selectedTickets.length === 0}
                className={`mt-4 w-full transition py-3 rounded-lg font-bold text-center ${
                  selectedTickets.length > 0
                    ? "bg-gradient-to-br from-orange-300 bg-orange-400 hover:bg-orange-700 text-gray-800"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                {selectedTickets.length > 0
                  ? `Order now`
                  : "Select Ticket First"}
              </button>
            </div>
          </>
        )}
        ;
      </div>
    </div>
  );
}
