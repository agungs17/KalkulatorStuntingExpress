import { next } from "@vercel/functions";

export const config = {
  matcher: ["/:path*"]
};

export default async function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api")) {
    // nanti akan ada tambahan untuk arcjet
    return next();
  }

  if (pathname === "/") {
    return new Response("<h1>Hello!</h1>", {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  return next();
}
