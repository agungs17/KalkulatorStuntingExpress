import express from "express";
import { sendEmailController } from "../controllers/job";

const job = express.Router();

// this all route to split task (non blocking task)
job.post("/send-email", sendEmailController);

export default job;