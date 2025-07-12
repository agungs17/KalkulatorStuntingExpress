import { rewrite } from "@vercel/edge";

export const config = {
  matcher: "/"
};

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname === "/api") {
    return rewrite(new URL("/api", request.url));
  }

  return;
}
