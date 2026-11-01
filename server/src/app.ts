import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

app.use(cors({ credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Travel Diaries API is operational",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default app;
