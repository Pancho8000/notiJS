import express from "express";
import { json } from "express";
import { notificationRouter } from "./routes/notificationRoutes";

const app = express();

app.use(json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/notifications", notificationRouter);

export { app };
