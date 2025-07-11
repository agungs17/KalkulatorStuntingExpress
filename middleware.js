export const config = {
  matcher: "/api/:path*" // intercept semua /api/*
};

export default function middleware(req) {
  console.log("🔥 Middleware hit:", req.url);

  const maintenance = true;

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
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }

  // 🟢 biarkan request lanjut
  return; // <--- ini kunci biar diteruskan
}