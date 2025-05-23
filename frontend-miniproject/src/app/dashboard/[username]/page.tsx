"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { IEvent } from "@/types/type";

export default function MatchesTabs() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ended">("upcoming");
  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // Events per page
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(
          `/events/organizer/${session.data?.user.id}`,
          {
            headers: { Authorization: `Bearer ${session.data?.accessToken}` },
          }
        );
        setEvents(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [session.data?.user.id, session.data?.accessToken]);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  // Sort Upcoming Events by Nearest Date
  const upcomingEvents = events
    .filter((e) => new Date(e.eventDate).getTime() > Date.now())
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );

  // Sort Ended Events by Latest Expired Date
  const endedEvents = events
    .filter((e) => new Date(e.eventDate).getTime() <= Date.now())
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );

  // Pagination
  const totalPages =
    activeTab === "upcoming"
      ? Math.ceil(upcomingEvents.length / itemsPerPage)
      : Math.ceil(endedEvents.length / itemsPerPage);

  const paginatedEvents =
    activeTab === "upcoming"
      ? upcomingEvents.slice(
          (currentPage - 1) * itemsPerPage,
          currentPage * itemsPerPage
        )
      : endedEvents.slice(
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
    <div className="p-5 md:p-10">
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
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((e) => (
            <div
              key={e.id}
              className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
            >
              <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
                {e.category}
              </h3>
              <Image
                src={e.image}
                alt={e.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-t-md mb-2 overflow-hidden"
              />
              <h3 className="text-lg font-semibold px-2">{e.title}</h3>
              <h4 className="text-base font-semibold px-2">{e.venue}</h4>
              <p className="text-sm text-gray-300 p-2">{e.location}</p>
              <p className="text-sm text-gray-300 px-2">
                {new Date(e.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <hr className="text-white mx-2 my-2" />
              <p className="text-sm text-gray-300 px-2">
                {e.startTime} - {e.endTime}
              </p>
              <p className="text-sm text-gray-300 px-2 mb-5">{e.venue}</p>
              {activeTab === "upcoming" && (
                <div className="flex justify-center mb-5">
                  <button
                    className="bg-radial w-[50%] from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600 text-shadow-md"
                    onClick={() => router.push(`/ticket/${e.id}`)} // Mengarahkan ke halaman create ticket
                  >
                    Add ticket
                  </button>
                </div>
              )}
              {activeTab === "ended" && (
                <div className="flex justify-center mb-5">
                  <button
                    className="bg-radial w-[50%] from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600 text-shadow-md"
                    onClick={() => router.push(`/review/${e.id}`)}
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
              ? "Start Create Events That Inspire"
              : "No ended matches!"}
          </div>
        )}
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-6 space-x-4 text-shadow-md font-semibold">
        <button
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
          className={`py-2 px-4 rounded ${
            currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
          }`}
        >
          Previous
        </button>
        <span className="text-white">{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages || paginatedEvents.length === 0}
          onClick={handleNextPage}
          className={`py-2 px-4 rounded ${
            currentPage === totalPages || paginatedEvents.length === 0
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
