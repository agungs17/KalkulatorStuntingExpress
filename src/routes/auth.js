import express from "express";
import { loginController, refreshTokenController, registerController } from "../controllers/auth";
import { validator } from "../middlewares/validator";

const auth = express.Router();

auth.post("/register", validator, registerController);
auth.post("/login", validator, loginController);
auth.post("/refresh-token", refreshTokenController);

export default auth;