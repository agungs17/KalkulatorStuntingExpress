import express from "express";
import { loginController, refreshTokenController, registerController } from "../controllers/auth";
import { validator, validatorWithUnique } from "../middlewares/validator";

const auth = express.Router();

auth.post("/check-unique", validator, validatorWithUnique, (_, res) => {
  return res.status(200).json({
    code: 200,
    message: "Data valid",
    data: null,
    error: null
  });
});
auth.post("/register", validator, validatorWithUnique, registerController);
auth.post("/login", validator, loginController);
auth.post("/refresh-token", refreshTokenController);

export default auth;