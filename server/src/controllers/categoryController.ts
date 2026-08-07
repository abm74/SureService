import { Request, Response, NextFunction } from "express";
import * as categoryService from "../services/categoryService.js";

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ categories });
  } catch (error) {
    return next(error);
  }
};
