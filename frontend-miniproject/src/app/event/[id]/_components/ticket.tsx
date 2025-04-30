import { ITicket } from "@/types/type";

interface IProps {
  ticket: ITicket[];
  isDisabled: (ticket: ITicket) => boolean;
  handleSelectTicket: (ticket: ITicket) => void;
}

export default function Ticket({
  ticket,
  isDisabled,
  handleSelectTicket,
}: IProps) {
  return (
    <div className="flex flex-col w-full">
      {ticket?.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => {
            if (!isDisabled(ticket)) handleSelectTicket(ticket);
          }}
          className={`border bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 rounded-md p-4 shadow-sm hover:shadow-md transition mb-4 cursor-pointer ${
            isDisabled(ticket)
              ? "opacity-50 pointer-events-none"
              : "hover:shadow-md"
          }`}
        >
          <h3 className="font-bold text-lg">{ticket?.category}</h3>
          <p className="">Price: IDR {ticket?.price.toLocaleString()}</p>
          <p className="">Stock: {ticket?.quantity}</p>
        </div>
      ))}
    </div>
  );
}
