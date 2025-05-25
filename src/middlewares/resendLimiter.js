import rateLimit from 'express-rate-limit';
import formatResponse from '../helpers/formatResponse.js'; // sesuaikan path jika beda

const resendLimiter = ({ minute, request, message }) => {
  return rateLimit({
    windowMs : minute * 60 * 1000,
    max : request,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      return formatResponse({ req, res, code: 429, error: 'Terlalu banyak permintaan', message: message || 'Silakan coba beberapa saat lagi' });
    }
  });
};

export default resendLimiter