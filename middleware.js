import { rewrite } from "@vercel/functions";

export default function middleware(request) {
  const url = new URL(request.url);

  if (url.pathname.startsWith("/")) {
    return rewrite(new URL("/api", request.url));
  }
}
