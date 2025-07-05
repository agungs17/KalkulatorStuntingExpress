export const config = { matcher: ["/api/:path*"], runtime: "edge" };

export default function middleware() {
  return new Response(
    JSON.stringify({
      code: 500,
      message: "Server sedang maintenance, tunggu beberapa saat lagi!",
      error: "Server Error",
      data: null,
    }),
    {
      status: 500,
      headers: { "Content-Type": "application/json" },
    }
  );
}
