// middleware.js
import { NextResponse } from "next/server";

export function middleware() {
  return new NextResponse("Unauthorized: Token tidak valid.", { status: 401 });
}

export const config = {
  matcher: "/:path*"
};