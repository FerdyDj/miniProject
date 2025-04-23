"use client"

import { useSession } from "next-auth/react";
import Image from "next/image";
import { VscVerifiedFilled } from "react-icons/vsc";

export default function Page() {
    const session = useSession();
    return (
        <div className="flex flex-col gap-3 h-screen items-center justify-center w-[100vw] md:w-[80vw] text-white text-xl">
            <Image src={`${session.data?.user.avatar}`} height={300} width={300} alt="profile-pic" className="rounded-full" />
            <h2 className="font-bold text-2xl">{session.data?.user.fullname}</h2>
            <p>{session.data?.user.username}</p>
            <div className="flex items-center gap-2 text-green-500 font-semibold">
            <p>Verified </p>
            <VscVerifiedFilled />
            </div>
            <p>{session.data?.user.email}</p>
            <p>Referral Code: {session.data?.user.refCode}</p>
        </div>
    )
}