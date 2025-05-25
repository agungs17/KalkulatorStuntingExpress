import express from "express";
import resendLimiter from "../middlewares/resendLimiter";
import authenticateToken from "../middlewares/authenticateToken";
import { resendEmailVerificationController, sendEmailForgotPassword } from "../controllers/invite";
import { validator } from "../middlewares/validator";

const invite = express.Router();

const limitInvite = resendLimiter({ minute: 3, request: 1 })

invite.get("/resend-email-verfication", authenticateToken, limitInvite, resendEmailVerificationController);
invite.post("/send-email-forgot-password", validator, limitInvite, sendEmailForgotPassword);

export default invite;