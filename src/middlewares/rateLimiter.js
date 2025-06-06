import rateLimit from "express-rate-limit";
import formatResponse from "../helpers/formatResponse.js"; // sesuaikan path jika beda

const rateLimiter = ({ minute, request, message }) => {
  return rateLimit({
    windowMs : minute * 60 * 1000,
    max : request,
    handler: (req, res) => {
      return formatResponse({ req, res, code: 429, error: "Terlalu banyak permintaan", message: message || "Terlalu banyak permintaan. Silakan coba beberapa saat lagi!" });
    }
  });
};

export default rateLimiter;