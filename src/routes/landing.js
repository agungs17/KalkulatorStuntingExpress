import express from "express";
import { formPasswordController, verifyEmailController } from "../controllers/landing";
import authenticateToken from "../middlewares/authenticateToken";
import { JWT_TYPE } from "../constants/type";

const landing = express.Router();

landing.get("/verify-email", authenticateToken({ requiredTypes : [JWT_TYPE.verificationEmail] }), verifyEmailController);
landing.get("/form-password", authenticateToken({ requiredTypes : [JWT_TYPE.forgotPasswordEmail] }), formPasswordController);

export default landing;