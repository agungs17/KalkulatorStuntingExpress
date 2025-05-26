import express from "express";
import { changePasswordEmailController, verifyEmailController, verifyPasswordEmailController } from "../controllers/landing";
import { validator } from "../middlewares/validator";

const invite = express.Router();

invite.get("/verify-email", verifyEmailController);
invite.get("/change-password", changePasswordEmailController);
invite.post("/verify-password", validator, verifyPasswordEmailController);

export default invite;