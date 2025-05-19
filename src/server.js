import express from "express";
import { formatResponse } from "./utils/scripts";
import auth from "./routes/auth";

const app = express();
const apiRouter = express.Router();

app.use(express.json());

apiRouter.get("/", (_, res) =>
  formatResponse({
    identifier: "healthCheck",
    res,
    msgSuccess: "API is running properly!",
  })
);
apiRouter.use("/auth", auth);

app.use("/api", apiRouter);

export default app;
