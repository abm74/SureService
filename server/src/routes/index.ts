import { Router } from "express";
import authRouter from "./auth.js";
import providerRouter from "./providers.js";
import bookingRouter from "./bookings.js";
import adminRouter from "./admin.js";
import reviewRouter from "./reviews.js";
import categoryRouter from "./categories.js";
import locationRouter from "./locations.js";
import uploadRouter from "./upload.js";

const routes = Router();

routes.use("/auth", authRouter);
routes.use("/providers", providerRouter);
routes.use("/bookings", bookingRouter);
routes.use("/admin", adminRouter);
routes.use("/reviews", reviewRouter);
routes.use("/categories", categoryRouter);
routes.use("/locations", locationRouter);
routes.use("/upload", uploadRouter);

export default routes;