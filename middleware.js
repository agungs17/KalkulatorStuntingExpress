import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.json(
    { message: "Blocked by middleware. Function was not invoked." },
    { status: 403 }
  );
}

export const config = {
  matcher: ["/api/:path*"], // intercept semua /api/*
};
