import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.message = err.message || "Internal Server Error";
  const status = (err as any).status || 500;

  if (err.cause === "custom") {
    res.status(status).json({
      status: "error",
      statusCode: status,
      message: err.message,
    });
  } else if (err.name === "ValidationError") {
    res.status(400).json({
      status: "error",
      statusCode: 400,
      message: err.message,
    });
  } else {
    res.status(status).json({
      status: "error",
      statusCode: status,
      message: "Internal Server Error",
    });
  }
};
