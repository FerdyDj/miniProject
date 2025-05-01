import { IEvent } from "@/types/type";
import Link from "next/link";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function RightBar({ event }: { event: IEvent | null }) {
  return (
    <div>
      <div className="bg-gray-800 rounded-t-2xl mt-12 p-6 space-y-6 shadow-lg h-fit">
        {/* Event Info */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-orange-400">
            {event?.category} Match
          </p>
          <h1 className="text-2xl font-bold text-white">{event?.title}</h1>
        </div>
        {/* Event Details */}
        <div className="text-sm text-gray-300 space-y-2">
          <p>
            <span className="font-semibold text-white">Date:</span>{" "}
            {event?.eventDate
              ? new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date not available"}
          </p>
          <p>
            <span className="font-semibold text-white">Time:</span>{" "}
            {event?.startTime} - {event?.endTime}
          </p>
          <p>
            <span className="font-semibold text-white">Location:</span>{" "}
            {event?.venue}, {event?.location}
          </p>
        </div>
        {/* Share Section */}
        <div className="flex items-center justify-between pt-4 border-gray-700">
          <span className="text-sm text-gray-300">Share Match</span>
          <div className="flex items-center space-x-4 text-white">
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=http://localhost:3000/event/${event?.id}`}
            >
              <FaFacebook className="w-8 h-8 text-blue-500 hover:text-blue-400 hover:cursor-pointer" />
            </Link>
            <Link
              href={`https://www.twitter.com/intent/tweet?url=http://localhost:3000/event/${event?.id}`}
            >
              <FaXTwitter className="w-8 h-8 text-black hover:text-gray-700 hover:cursor-pointer" />
            </Link>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=http://localhost:3000/event/${event?.id}`}
            >
              <FaLinkedin className="w-8 h-8 text-blue-500 hover:text-blue-400 hover:cursor-pointer" />
            </Link>
            <Link
              href={`https://wa.me/?text=http://localhost:3000/event/${event?.id}`}
            >
              <FaWhatsapp className="w-8 h-8 text-green-500 hover:text-green-400 hover:cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
