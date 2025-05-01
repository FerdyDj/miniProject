"use client";

import { useState, useEffect, use } from "react";
import axios from "@/lib/axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { IDiscount, IEvent, IPoint, ITicket } from "@/types/type";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Ticket from "./_components/ticket";
import ImageTab from "./_components/image";
import Description from "./_components/description";
import RightBar from "./_components/rightbar";
import PointDiscount from "./_components/pointdisc";

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
  const { data: session } = useSession();
  const { id } = use(params);
  const router = useRouter();

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
  }, [id]);

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

  const isDisabled = (ticket: ITicket) => {
    return (
      selectedTickets.length > 0 &&
      selectedTickets[0].category !== ticket.category
    );
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
    totalPrice = Math.max(0, totalPrice - points.amount);
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
      const response = await axios.post(`/orders`, payload, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      toast.success(response.data.message);
      router.push(response.data.invoice.invoiceUrl);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Side */}
      <div className="md:col-span-2 space-y-8">
        <ImageTab event={event} />
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
          {activeTab === "description" && <Description event={event} />}
          {activeTab === "ticket" && (
            <>
              {session?.user?.role !== "CUSTOMER" ? (
                <p className="text-white font-semibold text-lg">
                  To buy ticket please login first as a customer
                </p>
              ) : (
                <div className="mt-2 text-gray-800 text-shadow-md">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Tickets
                  </h2>
                  {ticket?.length === 0 ? (
                    <p className="text-white">
                      No tickets available for this event yet.
                    </p>
                  ) : (
                    <Ticket
                      ticket={ticket}
                      isDisabled={isDisabled}
                      handleSelectTicket={handleSelectTicket}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Right Sidebar */}
      <div>
        <RightBar event={event} />
        {/* Ticket Section */}
        {session?.user.role === "CUSTOMER" && (
          <>
            <div className="border-t bg-gray-800 border-gray-700 pt-6 space-y-6">
              <div className="flex justify-between items-center text-white font-bold">
                {selectedTickets.length > 0 ? (
                  <div className="space-y-4">
                    {selectedTickets.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center text-white gap-3"
                      >
                        <div className="px-6">
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
                  <p className="text-gray-400 text-sm bg-gray-800 px-6">
                    Select tickets to order
                  </p>
                )}
              </div>
            </div>
            {/* Discounts */}
            <PointDiscount
              points={points}
              discount={discount}
              usePoint={usePoint}
              setUsePoint={setUsePoint}
              useVoucher={useVoucher}
              setUseVoucher={setUseVoucher}
            />
            {/* Total Section */}
            <div className="border-t border-orange-300 p-6 bg-gray-800 rounded-b-2xl">
              <div className="flex justify-between text-white font-bold">
                <span>Total:</span>
                <span>IDR {Math.floor(totalPrice).toLocaleString()}</span>
              </div>
              <button
                onClick={handleOrder}
                disabled={selectedTickets.length === 0}
                className={`mt-4 w-full transition py-3 rounded-lg font-bold text-center cursor-pointer ${
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
