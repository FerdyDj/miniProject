import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex-row md:flex mt-20 md:mt-0 w-screen h-screen items-center justify-center text-white">
      <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
        <Image
          src="/HoopAuth.svg"
          width={300}
          height={300}
          alt="hoopauth-pic"
        />
        <h2 className="pt-4 text-5xl text-center">
          Welcome Back&nbsp;<span className="text-orange-500">Hoopers!</span>
        </h2>
        <p className="text-center p-6">Get ready to step back on the court!<br/>Login to manage your games or book your next matchup.</p>
      </div>
      <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
      <h2 className="pt-4 text-3xl text-center text-orange-500 font-bold">
          Login
        </h2>
        <p className="text-center p-6">Choose your role to sign in and get started.</p>
        <Link href="/login/customer" className="w-[60%] mt-3 text-center bg-black text-orange-500 font-semibold py-2 px-auto rounded-md text-shadow-sm transition duration-300 hover:bg-orange-400 hover:text-black border-2 hover:border-black">
            Login as Customer
        </Link>
        <Link href="/login/organizer" className="w-[60%] mt-3 mb-8 text-center bg-black text-orange-500 font-semibold py-2 px-auto rounded-md text-shadow-sm transition duration-300 hover:bg-orange-400 hover:text-black border-2 hover:border-black">
            Login as Organizer
        </Link>
      </div>
    </div>
  );
}
