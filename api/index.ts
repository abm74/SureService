import "dotenv/config";
import app from "../server/dist/app.js";
import connectDb from "../server/dist/config/db.js";

// Initialize database connection promise once
let dbPromise: Promise<void> | null = null;

export default function handler(req: any, res: any) {
  if (!dbPromise) {
    dbPromise = connectDb();
  }

  dbPromise
    .then(() => {
      // Allow express to handle the request.
      // Since this handler isn't async, Vercel will wait for res.end()
      app(req, res);
    })
    .catch((error) => {
      console.error("Vercel database connection error:", error);
      res.status(500).json({
        message: "Database connection error",
        error: error instanceof Error ? error.message : String(error),
      });
    });
}
