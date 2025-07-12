import { next, rewrite } from "@vercel/functions";
// import { Arcjet } from "@arcjet/vercel";

// const arcjet = new Arcjet({
//   token: process.env.ARCJET_TOKEN
// });

export const config = {
  matcher: ["/:path*"]
};

export default async function middleware(req) {
  const { pathname } = new URL(req.url);

  if (pathname.startsWith("/api")) {
    // const result = await arcjet.protect(req);

    // if (!result.ok) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "Request blocked by Arcjet",
    //     }),
    //     {
    //       status: result.status,
    //       headers: { "Content-Type": "application/json" },
    //     }
    //   );
    // }
    return next();
  }

  if (pathname === "/") {
    return rewrite(new URL("/api", req.url));
  }

  // Semua path lain (termasuk /landing) diterusin aja
  return next();
}
