import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import { Bounce, ToastContainer } from "react-toastify";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";
import Footbar from "@/components/footbar";

const figTree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HoopPass",
  description: "The Home of Basketball Game Ticketing!",
  icons: "/Basketball.svg",
  openGraph: {
    url: "https://res.cloudinary.com/dexlqslwj/image/upload/v1746112937/HoopPassMetaPic_xl460c.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${figTree.variable} antialiased bg-black`}>
        <SessionProvider session={session}>
          <Navbar />
          {children}
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            draggable
            theme="dark"
            transition={Bounce}
            closeOnClick
          />
          <Footbar />
        </SessionProvider>
      </body>
    </html>
  );
}
