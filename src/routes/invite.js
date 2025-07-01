import express from "express";
import rateLimiter from "../middlewares/rateLimiter";
import authenticateToken from "../middlewares/authenticateToken";
import { resendEmailVerificationController, sendEmailForgotPassword } from "../controllers/invite";
import { validator } from "../middlewares/validator";

const invite = express.Router();

const limitInvite = rateLimiter({ minute: 5, request: 5 });

invite.get("/resend-email-verfication", authenticateToken, limitInvite, resendEmailVerificationController);
invite.post("/send-email-forgot-password", validator, limitInvite, sendEmailForgotPassword);

export default invite;