import { next } from "@vercel/functions";

export const config = {
  matcher: ["/:path*"]
};

export default async function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api")) {
    // nanti akan ada tambahan untuk arcjet
    console.log("API request detected:", pathname);
    return;
  }

  if (pathname === "/") {
    console.log("Root path accessed, returning custom response.");
    return new Response("<h1>Hello!</h1>", {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }
  console.log("Non-API request detected, proceeding to next middleware.");
  return next();
}
