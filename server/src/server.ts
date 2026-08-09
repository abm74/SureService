import "dotenv/config";
import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 9000;

const assertRequiredEnv = () => {
  const missing: string[] = [];
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) {
    missing.push("MONGODB_URI (or MONGO_URI)");
  }
  if (!process.env.ACCESS_TOKEN_SECRET) {
    missing.push("ACCESS_TOKEN_SECRET");
  }
  if (!process.env.REFRESH_TOKEN_SECRET) {
    missing.push("REFRESH_TOKEN_SECRET");
  }
  if (missing.length > 0) {
    console.error(
      `Fatal: Missing required environment variables:\n  - ${missing.join("\n  - ")}\nPlease configure them before starting the server.`,
    );
    process.exit(1);
  }
};

const runServer = async () => {
  try {
    assertRequiredEnv();
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Critical server bootstrap error:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

runServer();
