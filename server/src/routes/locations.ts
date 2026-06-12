import { Router } from "express";
import { getLocations } from "../controllers/locationController.js";

const locationRouter = Router();

locationRouter.get("/", getLocations);

export default locationRouter;
