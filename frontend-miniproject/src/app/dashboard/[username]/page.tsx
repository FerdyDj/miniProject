"use client";

import React, { useEffect, useState } from "react";
import axios from "@/lib/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IEvents {
  id: number;
  title: string;
  image: string;
  eventDate: string;
  category: string;
  venue: string;
  startTime: string;
  endTime: string;
}

export default function MatchesTabs() {
  const [events, setEvents] = useState<IEvents[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "ended">("upcoming");
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/events")
      .then((res) => setEvents(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();

  // Upcoming: tanggal > hari ini, sort ascending, ambil hanya 1
  const upcomingEvents = events
    .filter((e) => new Date(e.eventDate) > today)
    .sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  const nextEvent = upcomingEvents[0] || null;

  // Ended: tanggal <= hari ini, sort descending
  const endedEvents = events
    .filter((e) => new Date(e.eventDate) <= today)
    .sort(
      (a, b) =>
        new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
    );

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

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
      {activeTab === "upcoming" && (
        <>
          {nextEvent ? (
            <div className="flex flex-col md:flex-row gap-4 items-center bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-4 rounded-lg shadow-md">
              {/* Image */}
              <div className="w-full md:w-1/2">
                <Image
                  src={nextEvent.image}
                  alt={nextEvent.title}
                  width={500}
                  height={300}
                  className="object-cover w-full rounded-md"
                />
              </div>
              {/* Details */}
              <div className="w-full md:w-1/2 flex flex-col">
                <h3 className="text-2xl font-bold mb-2">{nextEvent.title}</h3>
                <p className="text-gray-600 mb-1">
                  {new Date(nextEvent.eventDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-600 mb-1">{nextEvent.startTime} - {nextEvent.endTime}</p>
                <p className="text-gray-600 mb-3">
                  {nextEvent.category}, {nextEvent.venue || "Unknown Venue"}
                </p>
                <button
                  className="self-start bg-radial from-orange-300 to-orange-500 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:from-orange-300 hover:to-orange-600 text-shadow-md"
                  onClick={() =>
                    router.push(`/ticket/${nextEvent.id}`)
                  } // Mengarahkan ke halaman create ticket
                >
                  Add ticket
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center">No Upcoming Matches</div>
          )}
        </>
      )}

      {/* Ended Pane */}
      {activeTab === "ended" && (
        <>
          {endedEvents.length > 0 ? (
            <div className="space-y-6">
              {endedEvents.map((e) => (
                <div
                  key={e.id}
                  className="flex flex-col md:flex-row gap-4 items-center bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-4 rounded-lg shadow-md"
                >
                  <div className="w-full md:w-1/2">
                    <Image
                      src={e.image}
                      alt={e.title}
                      width={500}
                      height={300}
                      className="object-cover w-full rounded-md"
                    />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col">
                    <h3 className="text-xl font-semibold mb-1">{e.title}</h3>
                    <p className="text-gray-600 mb-1">
                      {new Date(e.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600 mb-1">{nextEvent.startTime} - {nextEvent.endTime}</p>
                    <p className="text-gray-600">
                      {e.category}, {e.venue || "Unknown Venue"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center">
              You don't have any matches that have ended or you haven't created
              a match—{" "}
              <a href="/matches/create" className="text-green-600 underline">
                start create matches!
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
