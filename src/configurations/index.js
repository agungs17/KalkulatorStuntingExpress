import dotenv from "dotenv";
dotenv.config();

const defaultPort = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || "dev";

const config = Object.freeze({
  port: defaultPort,
  nodeEnv,
  corsOrigin : nodeEnv === "dev" ? [`http://localhost:${defaultPort}`] : process.env.CORS_ORIGIN?.split(",") || [],
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bulkToken: process.env.SUPABASE_BULK_TOKEN,
    useSupabase : !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  },
  nodemailer : {
    port : process.env.EMAIL_PORT,
    host : process.env.EMAIL_HOST,
    service : process.env.EMAIL_SERVICE,
    email : process.env.EMAIL_USER,
    password : process.env.EMAIL_PASSWORD,
    useNodemailer : !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_HOST && process.env.EMAIL_SERVICE)
  },
  jwt : {
    secret : process.env.JWT_SECRET,
    ignoreExpiration : process.env.JWT_IGNORE_EXPIRATION === "true" ? true : false,
    unitExpired : process.env.JWT_UNIT_EXPIRED !== undefined ? process.env.JWT_UNIT_EXPIRED : 12,
    labelExpired : process.env.JWT_LABEL_EXPIRED || "hours"
  },
  logging: process.env.LOGGING === "true" || false,
  logflare : {
    sourceToken: process.env.LOGFLARE_SOURCE_TOKEN,
    apiKey: process.env.LOGFLARE_API_KEY,
    useLogflare: !!(process.env.LOGFLARE_API_KEY && process.env.LOGFLARE_SOURCE_TOKEN)
  }
});

export default config;
