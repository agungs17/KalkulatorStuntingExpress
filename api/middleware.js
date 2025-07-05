export default function middleware() {
  return new Response(
    JSON.stringify({ message: "Blocked by middleware" }),
    {
      status: 403,
      headers: { "content-type": "application/json" },
    }
  );
}
