import express from "express";
import { validator, validatorWithUnique } from "../middlewares/validator";
import authenticateToken from "../middlewares/authenticateToken";
import { addOrEditChildrenController, deleteChildrenController } from "../controllers/children";

const children = express.Router();

children.post("/add-or-edit", authenticateToken, validator, validatorWithUnique, addOrEditChildrenController);
children.delete("/delete", authenticateToken, deleteChildrenController);

export default children;