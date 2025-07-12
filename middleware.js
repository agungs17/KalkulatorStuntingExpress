import { next } from "@vercel/functions";

export const config = {
  matcher: "/api/:path*", // intercept semua path di bawah /api
};

export default function middleware(req) {
  const apiKey = req.headers.get("x-api-key");

  // ✅ Cek API Key
  if (apiKey !== process.env.SECRET_API_KEY) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Unauthorized",
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  return next();
}
