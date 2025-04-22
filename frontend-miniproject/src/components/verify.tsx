"use client";

import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyPage({ token }: { token: string }) {
  const [msg, setMsg] = useState<string>("");
  const router = useRouter();

  const onVerify = async () => {
    try {
      setMsg("Loading...");
      const { data } = await axios.patch(
        "/auth/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsg(data.message);
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (err) {
      console.log(err);
      setMsg("Verification Failed!");
      setTimeout(() => {
        router.push("/login");
      }, 5000);
    }
  };

  useEffect(() => {
    onVerify();
  }, []);

  return (
    <div className="flex h-screen w-screen justify-center items-center font-semibold">
      <h1 className="text-6xl text-shadow-lg text-orange-500">
        {msg}
        <br />
        <span className="text-sm text-orange-500 block mt-4 text-center">
          Redirecting the page in 5 seconds...
        </span>
      </h1>
    </div>
  );
}
