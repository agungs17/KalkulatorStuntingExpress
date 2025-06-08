import express from "express";
import { validator, validatorWithUnique } from "../middlewares/validator";
import authenticateToken from "../middlewares/authenticateToken";
import { addOrEditChildrenController } from "../controllers/children";

const children = express.Router();

children.post("/add-or-edit", authenticateToken, validator, validatorWithUnique, addOrEditChildrenController);

export default children;