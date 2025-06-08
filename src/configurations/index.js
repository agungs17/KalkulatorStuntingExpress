import dotenv from "dotenv";
dotenv.config();

const defaultPort = 3000;

const config = Object.freeze({
  port: process.env.PORT || defaultPort,
  nodeEnv: process.env.NODE_ENV || "dev",
  baseUrl : process.env.NODE_ENV === "dev" ? `http://localhost:${process.env.PORT || defaultPort}` : process.env.BASE_URL,
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    bulkToken: process.env.SUPABASE_BULK_TOKEN,
    useSupabase : process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  },
  nodemailer : {
    port : process.env.EMAIL_PORT,
    host : process.env.EMAIL_HOST,
    service : process.env.EMAIL_SERVICE,
    email : process.env.EMAIL_USER,
    password : process.env.EMAIL_PASSWORD,
    useNodemailer : process.env.EMAIL_USER && process.env.EMAIL_PASSWORD && process.env.EMAIL_HOST && process.env.EMAIL_SERVICE
  },
  jwt : {
    secret : process.env.JWT_SECRET,
    ignoreExpiration : process.env.JWT_IGNORE_EXPIRATION === "true" ? true : false,
    unitExpired : process.env.JWT_UNIT_EXPIRED !== undefined ? process.env.JWT_UNIT_EXPIRED : 12,
    labelExpired : process.env.JWT_LABEL_EXPIRED || "hours"
  },
  logging: process.env.LOGGING || false,
});

export default config;
