"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // untuk ambil query param
import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";

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

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 3; // Events per page


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
      }
    };

    fetchEvents();
  }, []);

  // 🔥 Filtering based on Search, Category, and Location
  const filteredEvents = events.filter((event) => {
    const matchesTitle = event.title.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory
      ? event.category.toLowerCase() === selectedCategory
      : true;
      const matchesLocation = selectedLocation
      ? event.location?.toLowerCase() === selectedLocation
      : true;

      const upComing = new Date(event.eventDate) > new Date();
    
    return matchesTitle && matchesCategory && matchesLocation && upComing;
  });

   // 🔢 Sort Events by Nearest Expiration Date
   const sortedEvents = filteredEvents.sort(
    (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage); // Calculate total pages
  const paginatedEvents = filteredEvents.slice(
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
      <h2 className="text-2xl font-bold text-white px-2 mt-12 md:px-8">
        All Events
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id}>
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
                src={event.image}
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
            </Link>
          ))
        ) : (
          <div className="p-0 md:p-8 text-white">No events found</div>
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