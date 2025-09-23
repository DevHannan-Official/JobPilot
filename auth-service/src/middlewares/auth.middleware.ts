import { type Request, type Response, type NextFunction } from 'express';
import ErrorHandler from '../lib/error-handler.js';
import redis from '../lib/redis.js';
import { prisma } from '../lib/prisma.js';

// Extend Express Request type for user property
import type { User } from '@prisma/client';
declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}

export const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const accessToken =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.split('Bearer ')[1]
      : undefined;
  const jidCookie = req.cookies?.jid as string;
  const refreshToken =
    typeof jidCookie === 'string' && jidCookie.startsWith('Bearer ')
      ? jidCookie.split('Bearer ')[1]
      : undefined;

  if (!accessToken && !refreshToken) {
    next(new ErrorHandler('Unauthorized', 401));
    return;
  } else if (!accessToken && refreshToken) {
    next(new ErrorHandler('Invalid or Expired Session', 401));
    return;
  }

  const userId = await redis.get(`accessToken:${accessToken}`);
  if (typeof userId !== 'string') {
    next(new ErrorHandler('Invalid or Expired Session', 401));
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    next(new ErrorHandler('Invalid or Expired Session', 401));
    return;
  }

  req.user = user;
  next();
};
