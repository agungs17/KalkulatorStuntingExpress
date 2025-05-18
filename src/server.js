import express from "express";
import { formatResponse } from "./utils/scripts";

export function createServer() {
  const app = express();

  app.get("/", (req, res) => {
    return formatResponse({ identifier : 'healthCheck',  res, msgSuccess: "Server is running properly!" });;
  });

  return app;
}
