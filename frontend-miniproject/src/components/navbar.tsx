"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CgCloseR, CgMenuLeft } from "react-icons/cg";
import MenuDesktop from "./menud";
import MenuMobile from "./menum";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const { data: session } = useSession();

  const isLogin = !!session;
  return (
    <nav className="fixed top-0 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 shadow-md w-screen z-50">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-800">
              <Image
                src="/NewHoopPass.svg"
                width={250}
                height={100}
                alt="hooppass-logo"
                className="w-auto h-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 items-center">
            <Link
              href="/crematch"
              className="text-gray-800 py-2 rounded-lg font-semibold transition duration-300 text-shadow-sm hover:text-white hover:text-shadow-gray-800"
            >
              Create Match
            </Link>
            <Link
              href="/dismatch"
              className="text-gray-800 px-4 py-2 rounded-lg font-semibold transition duration-300 text-shadow-sm hover:text-white hover:text-shadow-gray-800"
            >
              Discover Match
            </Link>

            {!isLogin ? (
              <MenuDesktop />
            ) : (
              <>
                <button
                  onClick={toggleMenu}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <div>
                    <Image
                      src={
                        session.user.avatar ||
                        "https://res.cloudinary.com/dexlqslwj/image/upload/v1744257672/blank-image_yfczs3_ogl5pp.jpg"
                      }
                      height={40}
                      width={40}
                      alt="avatar"
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-gray-800 font-medium text-left text-sm">
                    <div>{session.user?.fullname}</div>
                    <div>{session.user.email}</div>
                  </div>
                </button>

                {/* Avatar Menu */}
                {isOpen && (
                  <div className="absolute right-4 mt-45 w-60 bg-gradient-to-br from-orange-300 to-orange-400 rounded-md shadow-lg py-1 font-semibold text-center">
                    <Link
                      href="/profile"
                      className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 transition duration-300"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/ticket"
                      className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 transition duration-300"
                    >
                      My Ticket
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-300 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Burger Icon */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-black font-bold">
              {isOpen ? <CgCloseR size={24} /> : <CgMenuLeft size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-gradient-to-br from-orange-200 to-orange-400 shadow-lg border-t">
          {!isLogin ? (
            <MenuMobile />
          ) : (
            <div className="w-full py-1 font-semibold text-center text-shadow-md">
              <div className="flex flex-col items-center">
                <Image
                  src={
                    session.user.avatar ||
                    "https://res.cloudinary.com/dexlqslwj/image/upload/v1744257672/blank-image_yfczs3_ogl5pp.jpg"
                  }
                  height={100}
                  width={100}
                  alt="avatar"
                  className="rounded-full"
                />
              </div>
              <div className="text-gray-800 font-medium text-sm py-2">
                <div>{session.user?.fullname}</div>
                <div>{session.user.email}</div>
              </div>
              <hr className="my-2 text-gray-600" />
              <Link
                href="/profile"
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 transition duration-300"
              >
                Profile
              </Link>
              <Link
                href="/ticket"
                className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-300 transition duration-300"
              >
                My Ticket
              </Link>
              <hr className="my-2 text-gray-600" />
              <button
                onClick={() => signOut()}
                className="block w-full px-4 py-2 text-sm text-red-700 hover:bg-gray-300 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
