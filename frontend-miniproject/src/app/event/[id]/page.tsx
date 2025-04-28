"use client";

import { useState, useEffect, use } from "react";
import axios from "@/lib/axios";
import Image from "next/image";

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
}

interface ITicket {
  id: string;
  category: string;
  price: number;
  quantity: string;
}

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [ticket, setTicket] = useState<ITicket[] | null>(null);
  const [activeTab, setActiveTab] = useState<"description" | "ticket">(
    "description"
  );

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
  }, [id]);

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

          {activeTab === "ticket" && (
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
                      className="border bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-md p-4 shadow-sm hover:shadow-md transition"
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
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-gray-900 rounded-2xl mt-12 p-6 space-y-6 shadow-lg h-fit">
        {/* Event Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-orange-400">
            {event?.category} Match
          </p>
          <h1 className="text-2xl font-bold text-white">{event?.title}</h1>
        </div>

        {/* Event Details */}
        <div className="text-sm text-gray-400 space-y-2">
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
            {event?.location}
          </p>
        </div>

        {/* Ticket Section */}
        <div className="border-t border-gray-700 pt-4 space-y-4">
          <div className="flex justify-between items-center text-white font-bold">
            {/* <span>Total {totalTickets} ticket(s)</span> */}
            {/* <span>IDR {totalPrice.toLocaleString("id-ID")}</span> */}
          </div>
          <button
          // disabled={totalTickets === 0}
          // className={`w-full transition py-3 rounded-lg font-bold text-center ${
          //   totalTickets > 0 ? "bg-orange-500 hover:bg-orange-600 text-white" : "bg-gray-600 text-gray-300 cursor-not-allowed"
          // }`}
          >
            {/* {totalTickets > 0 ? "Order Ticket" : "Select Ticket First"} */}
          </button>
        </div>

        {/* Share Section */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <span className="text-sm text-gray-400">Share Match</span>
          <div className="flex items-center space-x-4 text-white">
            <button className="hover:scale-110 transition">🔗</button>
            <button className="hover:scale-110 transition">📩</button>
            <button className="hover:scale-110 transition">🟢</button>
          </div>
        </div>
      </div>
    </div>
  );
}
