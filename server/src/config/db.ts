import mongoose from "mongoose";

const connectDb = async () => {
  const mongodbUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongodbUri) {
    console.error("Critical: MONGODB_URI environment variable is missing.");
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const conn = await mongoose.connect(mongodbUri);
    console.log(
      `MongoDB connected at ${conn.connection.host} port:${conn.connection.port}`
    );
  } catch (error) {
    console.error("Unable to connect to database:", error instanceof Error ? error.message : error);
    throw error;
  }
};

export default connectDb;
