import express from "express";
import { bulkController, sendEmailController } from "../controllers/worker";

const worker = express.Router();

worker.get("/bulk", bulkController);
worker.post("/send-email", sendEmailController);

export default worker;