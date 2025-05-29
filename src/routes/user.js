import express from "express";
import { validator } from "../middlewares/validator";
import { changePasswordController } from "../controllers/user";

const user = express.Router();

user.post("/change-password", validator, changePasswordController);

export default user;