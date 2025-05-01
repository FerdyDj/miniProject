import { IEvent } from "@/types/type";

export default function Description({event}: {event: IEvent | null}) {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Description</h2>
        <p className="leading-relaxed">{event?.description}</p>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold text-white mb-2">
          Terms and Conditions
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Tickets are only available through the official platform.</li>
          <li>Tickets are non-refundable unless the event is canceled.</li>
          <li>Please bring a valid ID and proof of purchase to the event.</li>
        </ul>
      </div>
    </div>
  );
}
