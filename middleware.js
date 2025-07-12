import { rewrite } from "@vercel/functions";

export const config = {
  matcher: "/api"
};

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname === "/api") {
    return rewrite(new URL("/api", request.url));
  }
}
