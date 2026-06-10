import { Router } from "express";
import authRouter from "./auth.js";
import providerRouter from "./providers.js";
import bookingRouter from "./bookings.js";
import adminRouter from "./admin.js";
import reviewRouter from "./reviews.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/providers", providerRouter);
routes.use("/bookings", bookingRouter);
routes.use("/admin", adminRouter);
routes.use("/reviews", reviewRouter);

export default routes;