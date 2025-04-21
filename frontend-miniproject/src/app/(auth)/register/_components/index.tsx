import Image from "next/image";
import Link from "next/link";

export default function Register(){
    return(
        <div className="flex-row md:flex mt-20 md:mt-0 w-screen h-screen items-center justify-center text-white">
              <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
                <Image
                  src="/HoopAuth.svg"
                  width={500}
                  height={500}
                  alt="hoopauth-pic"
                />
              </div>
              <div className="w-full md:w-[50%] flex flex-col items-center justify-center">
              <h2 className="pt-4 text-3xl text-center text-orange-500 font-bold">
                  Create Your Hoop Account
                </h2>
                <p className="text-center p-6">Pick your role and step on the court.</p>
                <Link href="/register/customer" className="w-[60%] mt-3 text-center bg-black text-orange-500 font-semibold py-2 px-auto rounded-md text-shadow-sm transition duration-300 hover:bg-orange-400 hover:text-black border-2 hover:border-black">
                    Register as Customer
                </Link>
                <Link href="/register/organizer" className="w-[60%] mt-3 mb-8 text-center bg-black text-orange-500 font-semibold py-2 px-auto rounded-md text-shadow-sm transition duration-300 hover:bg-orange-400 hover:text-black border-2 hover:border-black">
                    Register as Organizer
                </Link>
              </div>
            </div>
    )
}