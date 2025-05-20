import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  logging: false
};

export default config;
