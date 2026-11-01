import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  const startServer = async (): Promise<void> => {
    try {
      await connectDB();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[Warning] Starting server without active MongoDB connection: ${message}`);
    }

    app.listen(PORT, () => {
      console.log(`[Server] Travel Diaries backend running on http://localhost:${PORT}`);
    });
  };

  void startServer();
}

export default app;
