import { rewrite } from "@vercel/functions";

export const config = {
  matcher: ["/:path*"]
};

export default function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api")) {
    console.log("🔥 Rewriting API request:", pathname);
    return rewrite(new URL(pathname, req.url));
  }

  if (pathname === "/") {
    return new Response("<h1>Hello!</h1>", {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  }

  console.log("Non-API request passthrough:", pathname);
  return rewrite(new URL(pathname, req.url));
}
