import Image from "next/image";

export default function Loading(){
    return(
        <div className="flex flex-col items-center justify-center h-screen w-screen animate-spin">
            <Image src={"/Basketball.svg"} width={200} height={200} alt="basketball-pic" />
        </div>
    )
}