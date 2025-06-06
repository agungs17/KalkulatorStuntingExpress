import configEnv from "./src/configurations";
import app from "./src/server";

if (!configEnv.supabase.useSupabase) {
  if (configEnv.nodeEnv === "dev") throw new Error("❌ tambahkan SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env (https://supabase.com)");
  else throw new Error("❌ Upss.. Sepertinya ada konfigurasi yang salah!");
}

if(!configEnv.jwt.jwtSecret) throw new Error("❌ tambahkan JWT_SECRET di .env");

// for local development
if (configEnv.nodeEnv === "dev") {
  const port = configEnv.port || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

// for serverless vercel
export default function handler(req, res) {
  return app(req, res);
}