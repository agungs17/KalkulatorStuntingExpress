import express from "express";
import config from "./configurations";
import formatResponse from "./helpers/formatResponse";
import { bulkController } from "./controllers/bulk";

import helmet from "helmet";
import cors from "cors";

import auth from "./routes/auth";
import landing from "./routes/landing";
import invite from "./routes/invite";
import user from "./routes/user";
import team from "./routes/team";
import children from "./routes/children";
import historyChildren from "./routes/historyChildren";

const app = express();
const apiRouter = express.Router();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const allowedOrigins = config.corsOrigin;

    if (allowedOrigins.includes(origin)) return callback(null, true);
    else return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Bulk-Token"]
}));
app.use(express.json());

if (config.nodeEnv === "dev") app.get("/", (_, res) => res.redirect("/api"));

apiRouter.get("/", (req, res) => formatResponse({ req, res, message: "API is running properly!" }));

// with /api (apiRouter.use)
// auth
apiRouter.use("/auth", auth);
// user
apiRouter.use("/user", user);
// children
apiRouter.use("/children", children);
// team
apiRouter.use("/team", team);
// invite
apiRouter.use("/invite", invite);
// history children
apiRouter.use("/history-children", historyChildren);
// bulk
apiRouter.use("/bulk", bulkController);

// mount apiRouter /api
app.use("/api", apiRouter);

// without /api (app.use)
// landing
app.use("/landing", landing);

export default app;