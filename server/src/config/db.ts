import mongoose from "mongoose";

let cachedPromise: Promise<typeof mongoose> | null = null;

export const connectDB = async (uri?: string): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!cachedPromise) {
    const mongoURI = uri || process.env.MONGO_URI || "mongodb://localhost:27017/travel_diaries";
    cachedPromise = mongoose
      .connect(mongoURI)
      .then((conn) => {
        console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
        return conn;
      })
      .catch((error) => {
        cachedPromise = null;
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[Database Error] Connection failed: ${message}`);
        throw error;
      });
  }

  return cachedPromise;
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    cachedPromise = null;
    console.log("[Database] MongoDB disconnected cleanly");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Database Error] Disconnection failed: ${message}`);
  }
};
