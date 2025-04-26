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
export default async function Page() {
  const response = await axios.get("/events");
  const events: IEvents[] = response.data.data;
  const friendly = events.filter((e) => e.category === "FRIENDLY");

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold text-white px-2 mt-12 md:px-8">
        All Category
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {friendly.length > 0 ? (
          friendly.map((event) => (
            <div
              key={event.id}
              className="w-auto h-auto rounded-lg shadow-md text-white border border-orange-400 relative"
            >
              <h3 className="absolute font-semibold right-0 top-3 px-2 bg-orange-600 rounded-l-md">
                {event.category}
              </h3>
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-t-md mb-2 overflow-hidden"
              />
              <h3 className="text-lg font-semibold px-2">{event.title}</h3>
              <h4 className="text-base font-semibold px-2">{event.venue}</h4>
              <p className="text-sm text-gray-300 p-2">{event.location}</p>
              <p className="text-sm text-gray-300 px-2">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <hr className="text-white mx-2 my-5" />
              <div className="flex items-center gap-3 m-2">
                <Image
                  src={`${event.organizer?.avatar}`}
                  height={40}
                  width={40}
                  alt="avatar-pic"
                />
                {event.organizer?.fullname}
              </div>
            </div>
          ))
        ) : (
          <div className="p-0 md:p-8 text-white">There is no Match Available</div>
        )}
      </div>
    </div>
  );
}
