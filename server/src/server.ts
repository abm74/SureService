import "dotenv/config";
import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 9000;

const runServer = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Critical server bootstrap error:",
      error instanceof Error ? error.message : error,
    );
  }
};

runServer();
