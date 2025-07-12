import { NextResponse } from "@vercel/edge";

export const config = {
  matcher: "/api/:path*"
};

export default function middleware(request) {
  const apiKey = request.headers.get("x-api-key");

  // ✅ Cek API Key dulu
  if (apiKey !== process.env.SECRET_API_KEY) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  // ✅ Lolos security, teruskan ke Express
  return NextResponse.next();
}
