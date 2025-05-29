import express from "express";
import { formPasswordController, verifyEmailController } from "../controllers/landing";

const landing = express.Router();

landing.get("/verify-email", verifyEmailController);
landing.get("/form-password", formPasswordController);

export default landing;