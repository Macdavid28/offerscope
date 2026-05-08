import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  console.error("Error encountered:", err);

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: messages,
    });
  }

  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};
