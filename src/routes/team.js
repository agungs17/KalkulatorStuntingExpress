import express from "express";
import { validator } from "../middlewares/validator";
import { addTeamController, createTeamController, deleteTeamController, getTeamController, leaveTeamController } from "../controllers/team";
import authenticateToken from "../middlewares/authenticateToken";

const team = express.Router();

team.post("/create", authenticateToken, validator, createTeamController);
team.post("/add-member", authenticateToken, validator, addTeamController);
team.get("/get", authenticateToken, getTeamController);
team.post("/leave", authenticateToken, validator, leaveTeamController);
team.delete("/delete", authenticateToken, deleteTeamController);

export default team;