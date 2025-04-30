import axios from "@/lib/axios";
import Image from "next/image";
import Link from "next/link";
import Marquee from "react-fast-marquee";

interface IEvents {
  id: number;
  title: string;
  image: string;
  eventDate: string;
  category: string;
}

export default async function DataCarousel() {
  const response = await axios.get("/events");
  const events: IEvents[] = response.data.data;

  const currentDate = new Date();

  // Filter events that haven't passed the eventDate
  const upcomingEvents = events.filter(
    (e) => new Date(e.eventDate) >= currentDate
  );
  const championship = upcomingEvents.filter(
    (e) => e.category === "CHAMPIONSHIP"
  );
  const league = upcomingEvents.filter((e) => e.category === "LEAGUE");
  const friendly = upcomingEvents.filter((e) => e.category === "FRIENDLY");

  return (
    <div className="p-5 md:p-10">
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">
        Upcoming Match
      </h2>
      <Marquee
        direction="right"
        pauseOnHover
        gradient
        gradientColor="rgb(0 0 0)"
        gradientWidth={50}
      >
        <div className="p-4 flex justify-center gap-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Link href={`/event/${event.id}`} key={event.id}>
                <div
                  className="w-[300px] h-[250px] rounded-lg shadow-md p-4 text-white relative"
                >
                  <h3 className="absolute font-semibold right-4 top-5.5 px-2 bg-orange-600 rounded-l-md">
                    {event.category}
                  </h3>
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={300}
                    height={200}
                    className="object-cover w-full rounded-md mb-2"
                  />
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-300">
                    {new Date(event.eventDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="p-0 md:p-8">There is no Match Available</div>
          )}
        </div>
      </Marquee>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">
        Championship Match
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-white">
        {championship.length > 0 ? (
          championship.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id}>
            <div
              key={event.id}
              className="w-auto h-auto rounded-lg shadow-md p-4 relative"
            >
              <h3 className="absolute font-semibold right-4 top-5.5 px-2 bg-orange-600 rounded-l-md">
                {event.category}
              </h3>
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-300">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            </Link>
          ))
        ) : (
          <div className="p-0 md:p-4">There is no Championship Match</div>
        )}
      </div>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">League Match</h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-white">
        {league.length > 0 ? (
          league.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id}>
            <div
              key={event.id}
              className="w-auto h-auto rounded-lg shadow-md p-4 relative"
            >
              <h3 className="absolute font-semibold right-4 top-5.5 px-2 bg-orange-600 rounded-l-md">
                {event.category}
              </h3>
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-300">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            </Link>
          ))
        ) : (
          <div className="p-0 md:p-4">There is no League Match</div>
        )}
      </div>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">
        Friendly Match
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-white">
        {friendly.length > 0 ? (
          friendly.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id}>
            <div
              key={event.id}
              className="w-auto h-auto rounded-lg shadow-md p-4 relative"
            >
              <h3 className="absolute font-semibold right-4 top-5.5 px-2 bg-orange-600 rounded-l-md">
                {event.category}
              </h3>
              <Image
                src={event.image}
                alt={event.title}
                width={300}
                height={200}
                className="object-cover w-full rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-300">
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            </Link>
          ))
        ) : (
          <div className="p-0 md:p-4">There is no Friendly Match</div>
        )}
      </div>
    </div>
  );
}
