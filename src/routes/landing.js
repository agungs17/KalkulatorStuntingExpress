import express from "express";
import { changePasswordEmailController, verifyEmailController, verifyPasswordEmailController } from "../controllers/landing";
import { validator } from "../middlewares/validator";

const landing = express.Router();

landing.get("/verify-email", verifyEmailController);
landing.get("/change-password", changePasswordEmailController);
landing.post("/verify-password", validator, verifyPasswordEmailController);

export default landing;