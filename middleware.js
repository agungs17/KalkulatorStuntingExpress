import { NextResponse } from "next/server";

export const config = {
  matcher: "/api/:path*" // 🟢 intercept semua /api/*
};

export default function middleware(req) {
  console.log("🔥 Middleware triggered:", req.url);

  const maintenance = false;

  if (maintenance) {
    return new Response(
      JSON.stringify({
        code: 503,
        message: "Server sedang maintenance, coba lagi nanti.",
        data: null,
        error: "ServiceUnavailable"
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  return NextResponse.next();
}