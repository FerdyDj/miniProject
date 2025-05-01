"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { IOrderTicket } from "@/types/ticket";
import { useRouter } from "next/navigation";

export default function TicketTabs() {
  const [ticket, setTicket] = useState<IOrderTicket[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Events per page
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/payments", {
          headers: { Authorization: `Bearer ${session.data?.accessToken}` },
        });
        setTicket(res.data.orders);
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [session.data?.accessToken]);

  // Pagination
  const totalPages = Math.ceil(ticket.length / itemsPerPage);


  const paginatedTickets = ticket.slice(
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
    <div className="mt-20 p-5 md:p-6">

      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {paginatedTickets.length > 0 ? (
          paginatedTickets.map((e) => (
            <div
              key={e.id}
              className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
            >
              <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
                {e.status}
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
                Tickets: {e.qty}
              </p>
              <p className="text-sm text-gray-300 px-2 mb-5">
                Ticket ID: {e.ticket.id.slice(0, -25)}
              </p>
              <div className="flex justify-center mb-5">
                  <button
                    className="bg-radial w-[70%] from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600 text-shadow-md"
                    onClick={() => router.push(`${e.invoiceUrl}`)}
                  >
                    Invoice
                  </button>
                </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center">
            No Payments Yet
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4 text-shadow-md font-semibold">
        <button
          disabled={paginatedTickets.length === 0 || currentPage === 1}
          onClick={handlePreviousPage}
          className={`py-2 px-4 rounded ${
            paginatedTickets.length === 0 || currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
          }`}
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={paginatedTickets.length === 0 || currentPage === totalPages}
          onClick={handleNextPage}
          className={`py-2 px-4 rounded ${
            paginatedTickets.length === 0 || currentPage === totalPages
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
