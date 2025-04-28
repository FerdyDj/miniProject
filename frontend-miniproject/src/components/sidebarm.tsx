"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { RiResetLeftLine } from "react-icons/ri";
import axios from "@/lib/axios";

export default function SidebarMatch() {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get("/events");
        const allEvents = Array.isArray(response.data.data) ? response.data.data : [];

        const locationsFromEvents = allEvents
          .map((event: any) => event.location || "Unknown Location")
          .filter((loc: string): loc is string => typeof loc === "string" && loc.trim() !== "");

        const uniqueLocations = Array.from(new Set(locationsFromEvents)).sort() as string[];

        setLocations(uniqueLocations);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-radial from-orange-200 via-orange-300 to-orange-400 
        text-gray-800 p-6 transform transition-transform duration-300 ease-in-out z-40 pt-20 font-semibold
        overflow-y-auto scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-64`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-bold">Filter</div>
          <Link
            href={"/dismatch"}
            className="flex items-center gap-1 hover:text-white transition duration-200"
          >
            <RiResetLeftLine className="h-6 w-6" />
            <p>Reset</p>
          </Link>
        </div>

        {/* Category Section */}
        <div>
          <h3 className="p-2 font-bold text-xl">Category</h3>
          <div className="flex flex-col space-y-2">
            <Link href={"/dismatch"} className="p-2 rounded-md hover:bg-gray-300">
              All Category
            </Link>
            <Link href={"/dismatch?category=friendly"} className="p-2 rounded-md hover:bg-gray-300">
              Friendly
            </Link>
            <Link href={"/dismatch?category=league"} className="p-2 rounded-md hover:bg-gray-300">
              League
            </Link>
            <Link href={"/dismatch?category=championship"} className="p-2 rounded-md hover:bg-gray-300">
              Championship
            </Link>
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-10">
          <h3 className="p-2 font-bold text-xl">Location</h3>
          <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-400 scrollbar-track-orange-200">
            <Link href={"/dismatch"} className="p-2 rounded-md hover:bg-gray-300">
              All Location
            </Link>

            {/* Mapping dynamic locations */}
            {locations.map((location) => (
              <Link
                key={location}
                href={`/dismatch?location=${encodeURIComponent(location.toLowerCase())}`}
                className="p-2 rounded-md hover:bg-gray-300"
              >
                {location}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-orange-300 to-orange-400 text-gray-800 p-3 rounded-full shadow-lg md:hidden"
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
    </div>
  );
}