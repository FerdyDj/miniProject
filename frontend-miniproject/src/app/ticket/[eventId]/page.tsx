import { auth } from "@/lib/auth";
import axios from "@/lib/axios";
import Image from "next/image";
import AddTicketModal from "./_components/ticket";
import TicketsList from "./_components/ticketlist";

interface IEvents {
  id: number;
  title: string;
  image: string;
  eventDate: string;
  category: string;
  startTime: string;
  endTime: string;
  venue: string;
}

export default async function Page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const user = await auth();
  const { eventId } = await params;
  const res = await axios.get(`/events/${eventId}`, {
    headers: {
      Authorization: `Bearer ${user?.accessToken}`,
    },
  });
  const event: IEvents = res.data.events;

  return (
    <div className="flex-row md:flex">
      <div className="p-10">
        <div className="flex flex-col md:flex-row gap-4 mt-16 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 p-4 rounded-lg h-auto my-5">
          {/* Image */}
          <div className="w-full md:w-1/2">
            <Image
              src={event.image}
              alt={`${event.title}`}
              width={500}
              height={300}
              className="object-cover w-full rounded-md"
            />
          </div>
          {/* Details */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
            <p className="text-gray-600 mb-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-600 mb-1">
              {event.startTime} - {event.endTime}
            </p>
            <p className="text-gray-600 mb-3">
              {event.category}, {event.venue}
            </p>
            <AddTicketModal eventId={event.id.toString()} />
          </div>
        </div>
        <hr className="w-full my-4 border-gray-300 flex justify-center" />
        <TicketsList eventId={event.id.toString()} />
      </div>
      <div className="flex flex-col items-center w-[100%] md:w-[50%] h-[50%] md:h-screen mt-20">
        <Image
          src={"/Ticket.png"}
          width={400}
          height={400}
          alt="ticket-pic"
          className="sticky top-20"
        />
      </div>
    </div>
  );
}
