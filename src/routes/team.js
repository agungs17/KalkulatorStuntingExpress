import express from "express";
import { validator } from "../middlewares/validator";
import { addTeamController, changeTeamLeaderController, createTeamController, deleteTeamController, leaveTeamController } from "../controllers/team";
import authenticateToken from "../middlewares/authenticateToken";

const team = express.Router();

team.post("/create", authenticateToken, validator, createTeamController);
team.post("/add-member", authenticateToken, validator, addTeamController);
team.post("/change-team-leader", authenticateToken, validator, changeTeamLeaderController);
team.post("/leave", authenticateToken, validator, leaveTeamController);
team.delete("/delete", authenticateToken, deleteTeamController);

export default team;