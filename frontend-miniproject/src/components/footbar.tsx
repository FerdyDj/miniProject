import Image from "next/image";
import Link from "next/link";
import {
  FaDiscord,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footbar() {
  return (
    <section className="pt-3 pb-8 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400">
      <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl font-semibold text-shadow-md text-gray-800">
        <div className="grid grid-cols-2 sm:col-span-4 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div className="col-span-2 md:col-span-4 lg:pr-8">
            <Image
              src="/NewHoopPass.svg"
              alt="logo-pic"
              width={400}
              height={100}
            ></Image>

            <p className="text-base leading-relaxed mt-7">
              &quot;The Home of Basketball Game Ticketing!&quot;
            </p>

            <ul className="flex items-center space-x-3 mt-9 text-white">
              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaTwitter />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaFacebook />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaInstagram />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaDiscord />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaGithub />
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex items-center justify-center transition-all duration-200 bg-gray-800 rounded-full w-7 h-7 hover:bg-orange-500"
                >
                  <FaXTwitter />
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold tracking-widest text-black uppercase">
              Company
            </p>

            <ul className="mt-7 space-y-4">
              <li>
                <Link
                  href="/"
                  className="flex text-base text-black transition-all duration-200 hover:text-white"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex text-base text-black transition-all duration-200 hover:text-white"
                >
                  Product
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="flex text-base text-black transition-all duration-200 hover:text-white"
                >
                  Teams
                </Link>
              </li>
            </ul>
          </div>

          <div className="mt-7">
            <p className="text-sm font-bold tracking-widest text-black uppercase">
              Help
            </p>

            <ul className="mt-7 space-y-4">
              <li>
                <Link
                  href="/"
                  title="customer-support"
                  className="flex text-base text-black transition-all duration-200 hover:text-white"
                >
                  Customer Support
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  title="terms&conditions"
                  className="flex text-base text-black transition-all duration-200 hover:text-white "
                >
                  Terms & Conditions
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  title="privacy-policy"
                  className="flex text-base text-black transition-all duration-200 hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <hr className="my-7 border-gray-600" />

        <p className="text-sm text-right text-gray-700">
          © Copyright 2025,{" "}
          <span className="font-bold">HoopPass</span> All Rights
          Reserved
        </p>
      </div>
    </section>
  );
}
