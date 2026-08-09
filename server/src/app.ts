import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
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

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests, please try again after 15 minutes" },
  skip: (req) => {
    const url = req.originalUrl || req.url;
    return url.includes("/auth/login") || url.includes("/auth/signup");
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many authentication attempts, please try again after 15 minutes" },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/signup", authLimiter);
app.use("/auth/login", authLimiter);
app.use("/auth/signup", authLimiter);

app.use(apiLimiter);

app.use("/api", routes);
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

export default app;
