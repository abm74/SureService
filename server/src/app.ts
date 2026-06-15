import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.set("trust proxy", 1);

const clientUrl = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.replace(/\/$/, "")
  : "http://localhost:5173";

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

export default app;
