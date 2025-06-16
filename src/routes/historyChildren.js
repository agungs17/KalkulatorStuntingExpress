import express from "express";
import authenticateToken from "../middlewares/authenticateToken";
import { addOrEditChildrenController, deleteHistoryChildrenController } from "../controllers/historyChildren";
import { validator } from "../middlewares/validator";

const historyChild = express.Router();

historyChild.post("/add-or-edit", authenticateToken, validator, addOrEditChildrenController);
historyChild.delete("/add-or-edit", authenticateToken, deleteHistoryChildrenController);

export default historyChild;