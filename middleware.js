import { next } from "@vercel/functions";
// import { Arcjet } from "@arcjet/vercel";

// const arcjet = new Arcjet({
//   token: process.env.ARCJET_TOKEN
// });

export const config = {
  matcher: ["/:path*"] // Intercept semua path
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

  // ✅ Kalau root path (/) → munculin halaman Hello!
  if (pathname === "/") {
    return new Response("<h1>Hello!</h1>", {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    });
  }

  // ✅ Semua path lain (misalnya /landing) diterusin aja
  return next();
}
