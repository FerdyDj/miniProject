import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });

  if (req.nextUrl.pathname == "/match") {
    if (!token || token.role !== "ORGANIZER") {
      return NextResponse.redirect(new URL("/login/organizer", req.url));
    }
  }

  return NextResponse.next();
}
