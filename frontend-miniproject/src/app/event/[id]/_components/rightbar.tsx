import { IEvent } from "@/types/type";

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
            <button className="hover:scale-110 transition">🔗</button>
            <button className="hover:scale-110 transition">📩</button>
            <button className="hover:scale-110 transition">🟢</button>
          </div>
        </div>
      </div>
    </div>
  );
}
