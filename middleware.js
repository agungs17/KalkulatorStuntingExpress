// middleware.js
import { NextResponse } from "@vercel/edge";

export function middleware() {
  return new NextResponse("Unauthorized: Token tidak valid.", { status: 401 });
}

export const config = {
  matcher: "/api/:path*"
};