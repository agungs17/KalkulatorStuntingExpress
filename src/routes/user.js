import express from "express";
import { validator } from "../middlewares/validator";
import { changePasswordController, profileController } from "../controllers/user";
import authenticateToken from "../middlewares/authenticateToken";
import { JWT_TYPE } from "../constants/type";

const user = express.Router();

user.get("/profile", authenticateToken, profileController);
user.post("/change-password", authenticateToken({requiredTypes : [JWT_TYPE.login, JWT_TYPE.forgotPasswordEmail]}), validator, changePasswordController);

export default user;