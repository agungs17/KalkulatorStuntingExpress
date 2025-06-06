import express from "express";
import config from "./configurations";
import formatResponse from "./helpers/formatResponse";
import { bulkController } from "./controllers/bulk";

import auth from "./routes/auth";
import landing from "./routes/landing";
import invite from "./routes/invite";
import user from "./routes/user";
import team from "./routes/team";

const app = express();
const apiRouter = express.Router();

app.use(express.json());

if (config.nodeEnv === "dev") app.get("/", (_, res) => res.redirect("/api"));

apiRouter.get("/", (req, res) => formatResponse({ req, res, message: "API is running properly!" }));

// with /api (apiRouter.use)
// auth
apiRouter.use("/auth", auth);
// user
apiRouter.use("/user", user);
// team
apiRouter.use("/team", team);
// invite
apiRouter.use("/invite", invite);
// bulk
apiRouter.use("/bulk", bulkController);

// mount apiRouter /api
app.use("/api", apiRouter);

// without /api (app.use)
// landing
app.use("/landing", landing);

export default app;