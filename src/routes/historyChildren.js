import express from "express";
import authenticateToken from "../middlewares/authenticateToken";

const historyChild = express.Router();

historyChild.post("/add", authenticateToken);

export default historyChild;