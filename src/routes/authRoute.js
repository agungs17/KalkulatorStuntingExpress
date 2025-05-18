// routes/auth.js
import express from "express";
import { formatResponse } from "../utils/scripts";

const router = express.Router();

router.get("/login", (req, res) => {
  return formatResponse({ identifier: 'login', res, msgSuccess: "Login successful!" });
});

export default router;