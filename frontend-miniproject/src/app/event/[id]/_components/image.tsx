import { IEvent } from "@/types/type";
import Image from "next/image";

interface IProps {
  event: IEvent | null;
}

export default function ImageTab({event}: IProps) {
  return (
    <div>
      <div className="w-full overflow-hidden mt-12 rounded-lg">
        <Image
          src={
            event?.image ||
            "https://images.template.net/114549/free-basketball-poster-background-edit-online.jpg"
          }
          alt={`${event?.title}`}
          width={1200}
          height={600}
          className="object-cover w-full h-auto"
        />
      </div>
    </div>
  );
}
