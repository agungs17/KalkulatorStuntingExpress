import axios from "axios";
import config from "../configurations";

const axiosCreate = (baseURL, headers = {}, timeout = 5000) => axios.create({ baseURL, headers, timeout });

const supabaseAxiosInstance = axiosCreate(config.supabase?.url, { Authorization: `Bearer ${config.supabase?.serviceRoleKey}`, "Content-Type": "application/json" }, 5000);

export { supabaseAxiosInstance };
