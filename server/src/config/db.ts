import mongoose from "mongoose";

export const connectDB = async (uri?: string): Promise<typeof mongoose> => {
  const mongoURI = uri || process.env.MONGO_URI || "mongodb://localhost:27017/travel_diaries";

  try {
    const conn = await mongoose.connect(mongoURI);
    console.log(`[Database] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Database Error] Connection failed: ${message}`);
    throw error;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("[Database] MongoDB disconnected cleanly");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Database Error] Disconnection failed: ${message}`);
  }
};
