"use client";

import { useState } from "react";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { RiResetLeftLine } from "react-icons/ri";

export default function SidebarMatch() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const session = useSession();

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 text-gray-800 p-6 transform transition-transform duration-300 ease-in-out z-40 pt-20 text-shadow-md font-semibold
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:w-64`}
      >
        <div className="flex justify-between">
          <div className="text-2xl font-bold mb-5">Filter</div>
            <Link href={"/dismatch"} className="mb-5 flex items-center justify-center gap-1 hover:text-white transition duration-200">
              <RiResetLeftLine className="h-6 w-6" />
              <p>Reset</p>
            </Link>
        </div>
        <h3 className="p-3 font-bold text-xl">Category</h3>
        <div className="flex flex-col space-y-3">
          <Link
            href={"/dismatch"}
            className="flex items-center gap-3 rounded-md p-3 transition duration-300 focus:bg-gray-300 hover:bg-gray-300"
          >
            All Category
          </Link>
          <Link
            href={"/dismatch/championship"}
            className="flex items-center gap-3 rounded-md p-3 transition duration-300 focus:bg-gray-300 hover:bg-gray-300"
          >
            Championship Match
          </Link>
          <Link
            href={"/dismatch/league"}
            className="flex items-center gap-3 rounded-md p-3 transition duration-300 focus:bg-gray-300 hover:bg-gray-300"
          >
            League Match
          </Link>
          <Link
            href={"/dismatch/friendly"}
            className="flex items-center gap-3 rounded-md p-3 transition duration-300 focus:bg-gray-300 hover:bg-gray-300"
          >
            Friendly Match
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
    </div>
  );
}
