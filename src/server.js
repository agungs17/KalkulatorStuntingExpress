import express from "express";
import { formatResponse } from "./utils/scripts";
import auth from "./routes/auth";

export function createServer() {
  const app = express();
  app.get("/", (_, res) => formatResponse({ identifier : 'healthCheck',  res, msgSuccess: "Server is running properly!" }))
  app.use("/auth", auth);

  return app;
}
