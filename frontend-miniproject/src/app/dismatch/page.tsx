"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // untuk ambil query param
import axios from "@/lib/axios";
import Image from "next/image";

interface IEvents {
  id: number;
  title: string;
  image: string;
  eventDate: string;
  category: string;
  startTime: string;
  endTime: string;
  venue: string;
  location: string;
  organizer?: {
    avatar: string;
    fullname: string;
  };
}

export default function Page() {
  const [events, setEvents] = useState<IEvents[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";
  const selectedCategory = searchParams.get("category")?.toLowerCase() || "";
  const selectedLocation = searchParams.get("location")?.toLowerCase() || "";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("/events");
        setEvents(response.data.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading events...</div>;
  }

  // 🔥 Filtering based on Search, Category, and Location
  const filteredEvents = events.filter((event) => {
    const matchesTitle = event.title.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory
      ? event.category.toLowerCase() === selectedCategory
      : true;
      const matchesLocation = selectedLocation
      ? event.location?.toLowerCase() === selectedLocation
      : true;
    
    return matchesTitle && matchesCategory && matchesLocation;
  });

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold text-white px-2 mt-12 md:px-8">
        All Events
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
            >
              {/* Category badge */}
              <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
                {event.category}
              </h3>
              {/* Image */}
              <Image
                src={event.image || "/fallback-image.jpg"}
                alt={event.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-t-md mb-2 overflow-hidden"
              />
              {/* Title */}
              <h3 className="text-lg font-semibold px-2">{event.title}</h3>
              {/* Venue */}
              <h4 className="text-base font-semibold px-2">{event.venue}</h4>
              {/* Location */}
              <p className="text-sm text-gray-300 p-2">{event.location}</p>
              {/* Event Date */}
              <p className="text-sm text-gray-300 px-2">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <hr className="text-white mx-2 my-5" />
              {/* Organizer Section */}
              <div className="flex items-center gap-3 m-2">
                <Image
                  src={`${event.organizer?.avatar}`}
                  height={40}
                  width={40}
                  alt="avatar-pic"
                />
                {event.organizer?.fullname || "Organizer Name"}
              </div>
            </div>
          ))
        ) : (
          <div className="p-0 md:p-8 text-white">No events found</div>
        )}
      </div>
    </div>
  );
}