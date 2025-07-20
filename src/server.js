import express from "express";
import config from "./configurations";
import formatResponse from "./helpers/formatResponse";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { createLazyRouter } from "express-lazy-router";

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
  allowedHeaders: ["Content-Type", "Authorization", "X-Secret-Key"]
}));
app.use(express.json());
app.use(compression({
  threshold: 312, // only compress response bodies larger than 312 bytes
}));
const lazy = createLazyRouter({
  preload : config.nodeEnv === "prod"
});

if (config.nodeEnv === "dev") app.get("/", (_, res) => res.redirect("/api"));

apiRouter.get("/", (req, res) => formatResponse({ req, res, message: "API is running properly!" }));

// with /api (apiRouter.use)
// auth
apiRouter.use("/auth", lazy(() => import("./routes/auth.js")));
// user
apiRouter.use("/user", lazy(() => import("./routes/user.js")));
// children
apiRouter.use("/children", lazy(() => import("./routes/children.js")));
// team
apiRouter.use("/team", lazy(() => import("./routes/team.js")));
// invite
apiRouter.use("/invite", lazy(() => import("./routes/invite.js")));
// history children
apiRouter.use("/history-children", lazy(() => import("./routes/historyChildren.js")));
// worker
apiRouter.use("/worker", lazy(() => import("./routes/worker.js")));

// mount apiRouter /api
app.use("/api", apiRouter);

// without /api (app.use)
// landing
app.use("/landing", lazy(() => import("./routes/landing.js")));

export default app;