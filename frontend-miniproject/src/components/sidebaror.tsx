"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { MdEventNote } from "react-icons/md";
import { FaChartBar } from "react-icons/fa";

export default function SidebarOrganizer() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const session = useSession();

  return (
    <div>
      {/* Sidebar for Organizer */}
      {session.data?.user.role === "ORGANIZER" && (
        <>
          <nav
            className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 text-gray-800 p-6 transform transition-transform duration-300 ease-in-out z-40 pt-20 text-shadow-md font-semibold
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-64`}
          >
            <div className="text-2xl font-bold mb-8 text-center">Organizer Dashboard</div>
            <div className="flex flex-col space-y-6">
              <Link
                href={`/dashboard/${session.data.user.username}`}
                className="flex items-center gap-3 rounded-md p-3 transition duration-300 hover:bg-gray-300"
              >
                <MdEventNote className="w-5 h-5" />
                My Event
              </Link>
              <Link
                href={`/dashboard/${session.data.user.username}/chart`}
                className="flex items-center gap-3 rounded-md p-3 transition duration-300 hover:bg-gray-300"
              >
                <FaChartBar className="w-5 h-5" />
                Chart Data
              </Link>
            </div>
          </nav>

          {/* Toggle Button (Mobile only) */}
          <button
            onClick={toggleSidebar}
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-br from-orange-300 to-orange-400 text-gray-800 p-3 rounded-full shadow-lg md:hidden"
            aria-label="Toggle Sidebar"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </>
      )}
    </div>
  );
}