import axios from "axios";
import config from "../configurations";

const baseURL = config.baseUrl

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
