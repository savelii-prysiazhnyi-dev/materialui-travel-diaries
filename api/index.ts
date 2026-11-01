import type { Request, Response } from "express";
import app from "../server/src/app.js";
import { connectDB } from "../server/src/config/db.js";

export default async function handler(req: Request, res: Response) {
  try {
    await connectDB();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Vercel Serverless] MongoDB connection error:", message);
  }

  return app(req, res);
}
