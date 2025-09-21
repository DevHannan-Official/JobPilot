import type { Request, Response } from 'express';

// Custom error type for better type safety
interface CustomError extends Error {
  status?: number;
  cause?: string;
}

export const errorMiddleware = (err: CustomError, _req: Request, res: Response): void => {
  const status: number = typeof err.status === 'number' ? err.status : 500;
  const message: string = err.message || 'Internal Server Error';

  if (err.cause === 'custom') {
    res.status(status).json({
      status: 'error',
      statusCode: status,
      message,
    });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 'error',
      statusCode: 400,
      message,
    });
    return;
  }

  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: 'Internal Server Error',
  });
};
