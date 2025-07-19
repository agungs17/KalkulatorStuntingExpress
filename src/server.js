import express from "express";
import config from "./configurations";
import formatResponse from "./helpers/formatResponse";

import helmet from "helmet";
import cors from "cors";

import auth from "./routes/auth";
import landing from "./routes/landing";
import invite from "./routes/invite";
import user from "./routes/user";
import team from "./routes/team";
import children from "./routes/children";
import historyChildren from "./routes/historyChildren";
import compression from "compression";
import worker from "./routes/worker";

const app = express();
const apiRouter = express.Router();

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "script-src": ["'self'", "'unsafe-inline'"]
    },
  })
);
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
app.use(compression({
  threshold: 312, // only compress response bodies larger than 312 bytes
}));

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
// worker
apiRouter.use("/worker", worker);

// mount apiRouter /api
app.use("/api", apiRouter);

// without /api (app.use)
// landing
app.use("/landing", landing);

export default app;