import express from "express";
import authenticateToken from "../middlewares/authenticateToken";
import { addOrEditChildrenController, deleteHistoryChildrenController } from "../controllers/historyChildren";
import { validator } from "../middlewares/validator";

const historyChild = express.Router();

historyChild.post("/add-or-edit", authenticateToken, validator, addOrEditChildrenController);
historyChild.delete("/delete", authenticateToken, deleteHistoryChildrenController);

export default historyChild;