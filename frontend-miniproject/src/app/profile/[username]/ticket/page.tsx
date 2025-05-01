"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IOrderTicket } from "@/types/ticket";
import { useRouter } from "next/navigation";

export default function TicketTabs() {
  const [ticket, setTicket] = useState<IOrderTicket[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ended">("upcoming");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Events per page
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`/orders/${session.data?.user.id}`, {
          headers: { Authorization: `Bearer ${session.data?.accessToken}` },
        });
        setTicket(res.data.orders);
        console.log(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [session.data?.user.id, session.data?.accessToken]);

  // Sort Upcoming Events by Nearest Date
  const upcomingTickets = ticket
    .filter((e) => new Date(e.ticket.event.eventDate).getTime() > Date.now())
    .sort(
      (a, b) =>
        new Date(a.ticket.event.eventDate).getTime() -
        new Date(b.ticket.event.eventDate).getTime()
    );

  // Sort Ended Events by Latest Expired Date
  const endedTickets = ticket
    .filter((e) => new Date(e.ticket.event.eventDate).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.ticket.event.eventDate).getTime() -
        new Date(a.ticket.event.eventDate).getTime()
    );

    // Select Tickets Based on Active Tab
  const currentTickets =
  activeTab === "upcoming" ? upcomingTickets : endedTickets;


  // Pagination
  const totalPages = Math.ceil(currentTickets.length / itemsPerPage);


  const paginatedTickets = currentTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="p-5 md:p-6">
      {/* Tab buttons */}
      <div className="flex border-b mt-12">
        <button
          onClick={() => setActiveTab("upcoming")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "upcoming"
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Upcoming Matches
        </button>
        <button
          onClick={() => setActiveTab("ended")}
          className={`ml-4 px-4 py-2 font-semibold ${
            activeTab === "ended"
              ? "border-b-2 border-orange-600 text-orange-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Ended Matches
        </button>
      </div>

      {/* Upcoming Panel */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {paginatedTickets.length > 0 ? (
          paginatedTickets.map((e) => (
            <div
              key={e.id}
              className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
            >
              <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
                {e.ticket.category}
              </h3>
              <Image
                src={"/Ticket.png"}
                alt={e.ticket.event.title}
                width={100}
                height={100}
                className="object-cover w-full rounded-t-md mb-2 overflow-hidden"
              />
              <h3 className="text-lg font-semibold px-2">
                {e.ticket.event.title}
              </h3>
              <h4 className="text-base font-semibold px-2">
                {e.ticket.event.venue}
              </h4>
              <hr className="text-white mx-2 my-2" />
              <p className="text-sm text-gray-300 p-2">
                {e.ticket.event.startTime} - {e.ticket.event.endTime}
              </p>
              <p className="text-sm text-gray-300 px-2">
                {new Date(e.ticket.event.eventDate).toLocaleDateString(
                  "en-US",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
              <p className="text-sm text-gray-300 px-2 py-2">
                {e.ticket.event.location}
              </p>
              <p className="text-sm text-gray-300 px-2 mb-5">
                Ticket ID: {e.ticket.id.slice(0, -25)}
              </p>
              {activeTab === "ended" && (
                <div className="flex justify-center mb-5">
                  <button
                    className="bg-radial w-[50%] from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600 text-shadow-md"
                    onClick={() => router.push(`/review/${e.ticket.event.id}`)}
                  >
                    Review
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">
            {activeTab === "upcoming"
              ? "No upcoming matches."
              : "No ended matches."}
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4 text-shadow-md font-semibold">
        <button
          disabled={currentTickets.length === 0 || currentPage === 1}
          onClick={handlePreviousPage}
          className={`py-2 px-4 rounded ${
            currentTickets.length === 0 || currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
          }`}
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentTickets.length === 0 || currentPage === totalPages}
          onClick={handleNextPage}
          className={`py-2 px-4 rounded ${
            currentTickets.length === 0 || currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
