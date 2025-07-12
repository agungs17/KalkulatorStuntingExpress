import { next } from "@vercel/functions";
// import { Arcjet } from "@arcjet/vercel";
import landingHtml from "./public/html/landing-page.html";

// const arcjet = new Arcjet({
//   token: process.env.ARCJET_TOKEN
// });

export const config = {
  matcher: ["/:path*"]
};

export default async function middleware(req) {
  const { pathname } = new URL(req.url);

  // ✅ Kalau request ke /api → teruskan ke backend
  if (pathname.startsWith("/api")) {
    // Kalau mau aktifkan Arcjet, uncomment kode di bawah
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
    return new Response(landingHtml, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  return next();
}
