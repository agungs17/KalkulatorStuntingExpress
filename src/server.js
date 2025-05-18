import express from "express";
import { formatResponse } from "./utils/scripts";
import auth from "./routes/auth";

export function createServer() {
  const app = express();
  const apiRouter = express.Router();

  app.use(express.json());
  app.get("/", (_, res) => res.redirect("/api"));

  apiRouter.get("/", (_, res) => formatResponse({ identifier: 'healthCheck', res, msgSuccess: "API is running properly!" }))
  apiRouter.use("/auth", auth);

  app.use("/api", apiRouter);
  return app;
}
