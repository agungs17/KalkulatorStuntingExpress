import dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'dev',
  baseUrl : process.env.NODE_ENV === 'dev' ? `http://localhost:${process.env.PORT}` : process.env.BASE_URL,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    useSupabase : process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  useNodemailer: process.env.USE_NODEMAILER || false,
  jwtSecret : process.env.JWT_SECRET,
  logging: process.env.LOGGING || false,
});

export default config;
