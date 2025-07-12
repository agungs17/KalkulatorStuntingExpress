import { next, rewrite } from "@vercel/functions";

export const config = {
  matcher: ["/:path*"]
};

export default function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api")) {
    // untuk api (ada tambahan arcjet nanti)
    return next();
  }

  if (pathname === "/") {
    return rewrite(new URL("/landing-page.html", req.url));
  }

  return next();
}
