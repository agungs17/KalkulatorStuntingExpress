import express from "express";
import { validator } from "../middlewares/validator";
import { createTeamController } from "../controllers/team";
import authenticateToken from "../middlewares/authenticateToken";

const team = express.Router();

team.post("/create-team", authenticateToken, validator, createTeamController);

export default team;