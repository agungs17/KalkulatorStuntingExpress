// routes/auth.js
import express from "express";
import { loginController } from "../controllers/auth";

const app = express.Router();

app.get("/login", loginController);
app.get("/register", loginController);

export default app;