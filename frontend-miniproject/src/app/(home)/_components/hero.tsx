import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="flex-row md:flex min-h-screen max-w-screen">
      <div className="flex flex-col p-8 md:p-0 pt-16 md:pt-0 md:pl-20 justify-center text-white w-[100%] md:w-[50%] h-auto md:h-screen">
        <h1 className="text-4xl font-bold py-3">Unlock Courtside Intensity</h1>
        <h2 className="text-3xl font-semibold py-3">
          Feel the Roar. Secure Your Seat. Live the Game.
        </h2>
        <p className="py-3">
          Welcome to HoopPass, the definitive solution for basketball ticketing.
          Crafted for devoted fans and dedicated organizers, HoopPass makes
          securing your spot or setting up your event incredibly simple.
          Experience the fastest way to access the thrill of the game or manage
          your sell-out crowd. Get closer to the action. HoopPass makes it
          happen.
        </p>
        <div className="flex justify-evenly mt-7">
          <Link href={"/match"} className="bg-orange-600 py-3 px-7 rounded-md cursor-pointer font-semibold text-shadow-md border-2 border-black transition duration-300 hover:border-white hover:bg-gradient-to-t hover:from-amber-500 hover:to-orange-600 hover:shadow-amber-500 hover:shadow-lg">Create Match</Link>
          <Link href={"/dismatch"} className="bg-orange-600 py-3 px-7 rounded-md cursor-pointer font-semibold text-shadow-md border-2 border-black transition duration-300 hover:border-white hover:bg-gradient-to-t hover:from-amber-500 hover:to-orange-600 hover:shadow-amber-500 hover:shadow-lg">Discover Match</Link>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center w-[100%] md:w-[50%] h-[50%] md:h-screen">
        <Image src={"/hero3d.png"} width={500} height={500} alt="hero-pic" />
      </div>
    </div>
  );
}
