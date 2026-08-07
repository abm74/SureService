import { Request, Response, NextFunction } from "express";
import * as locationService from "../services/locationService.js";

export const getLocations = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const locations = await locationService.getAllLocations();
    return res.status(200).json({ locations });
  } catch (error) {
    return next(error);
  }
};
