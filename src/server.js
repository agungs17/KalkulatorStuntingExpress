import express from "express";
import config from "./configurations";
import formatResponse from "./helpers/formatResponse";

import auth from "./routes/auth";
import landing from "./routes/landing";
import invite from "./routes/invite";
import job from "./routes/job";

const app = express();
const apiRouter = express.Router();

app.use(express.json());

if (config.nodeEnv === 'dev') app.get("/", (_, res) => res.redirect("/api"));

apiRouter.get("/", (req, res) => formatResponse({ req, res, message: "API is running properly!", }));

// with /api (apiRouter.use)
// auth
apiRouter.use("/auth", auth);

// invite
apiRouter.use("/invite", invite);

// jobs - this route to split task (non blocking task)
apiRouter.use("/job", job);

// mount apiRouter /api
app.use("/api", apiRouter);

// without /api (app.use)
// landing
app.use("/landing", landing);

export default app;