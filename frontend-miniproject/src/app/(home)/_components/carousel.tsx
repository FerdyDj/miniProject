import axios from "@/lib/axios";
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
          {events.length > 0
            ? events.map((event) => (
                <div
                  key={event.id}
                  className="w-[300px] h-[250px] rounded-lg shadow-md p-4 text-white"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-[150px] object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-300">
                    {new Date(event.eventDate).toDateString()}
                  </p>
                </div>
              ))
            : "Not Available"}
        </div>
      </Marquee>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">
        Championship Match
      </h2>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {events.length > 0
          ? events.map((event) => (
              <div
                key={event.id}
                className="w-[300px] h-[250px] rounded-lg shadow-md p-4 text-white"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[150px] object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(event.eventDate).toDateString()}
                </p>
              </div>
            ))
          : "Not Available"}
      </div>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">League Match</h2>
      <div className="p-4 flex justify-center gap-3">
        {events.length > 0
          ? events.map((event) => (
              <div
                key={event.id}
                className="w-[300px] h-[250px] rounded-lg shadow-md p-4 text-white"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[150px] object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(event.eventDate).toDateString()}
                </p>
              </div>
            ))
          : "Not Available"}
      </div>
      <h2 className="text-2xl font-bold text-white p-2 md:p-8">
        Friendly Match
      </h2>
      <div className="p-4 flex justify-center gap-3">
        {events.length > 0
          ? events.map((event) => (
              <div
                key={event.id}
                className="w-[300px] h-[250px] rounded-lg shadow-md p-4 text-white"
              >
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[150px] object-cover rounded-md mb-2"
                />
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-300">
                  {new Date(event.eventDate).toDateString()}
                </p>
              </div>
            ))
          : "Not Available"}
      </div>
    </div>
  );
}
