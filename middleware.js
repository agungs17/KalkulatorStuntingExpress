export function middleware() {
  return new Response(JSON.stringify({ message : "Error Server" }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

export const config = {
  matcher: "/api/:path*"
};