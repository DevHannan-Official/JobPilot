import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import ErrorHandler from '../lib/error-handler.js';
import { issueAccessToken, issueRefreshToken } from '../lib/token.js';
import { comparePassword, deleteAccessToken, hashPassword, saveAccessToken } from '../lib/utils.js';
import { ENV } from '../lib/env.js';

// /sign-up -> POST
export const signUpUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body as {
    name: string;
    email: string;
    password: string;
  };

  // Checking if user already exists
  const isExists = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isExists) {
    next(new ErrorHandler('User already exists', 400));
    return;
  }

  const hashedPasword = await hashPassword(password);

  // Creating user to database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPasword,
    },
  });

  // Generate both refresh token and access token
  const refreshToken = 'Bearer ' + issueRefreshToken(user.id);
  const accessToken = issueAccessToken();

  // Saving Access Token to redis
  await saveAccessToken(accessToken, user.id);

  // Sending response with succes message along with a refresh token contained cookie
  res
    .status(201)
    .cookie('jid', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ENV.REFRESH_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
    })
    .json({ status: 'success', statusCode: 201, message: 'Signed Up successfully', accessToken });
});

// /sign-in -> POST
export const signInUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  // Checking if user exists
  if (!user) {
    next(new ErrorHandler('Please enter correct credentials', 404));
    return;
  }

  // Checking if password is correct
  const isPasswordMatched = await comparePassword(password, user.password!);

  if (!isPasswordMatched) {
    next(new ErrorHandler('Please enter correct credentials', 404));
    return;
  }

  // Generate both refresh token and access token
  const refreshToken = 'Bearer ' + issueRefreshToken(user.id);
  const accessToken = issueAccessToken();

  // Saving Access Token to redis
  await saveAccessToken(accessToken, user.id);

  // Sending response with succes message along with a refresh token contained cookie
  res
    .status(200)
    .cookie('jid', refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: ENV.REFRESH_COOKIE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000,
    })
    .json({ status: 'success', statusCode: 200, message: 'Signed In successfully', accessToken });
});

export const logoutUser = asyncHandler((req: Request, res: Response, _next: NextFunction) => {
  // Clearing cookie from client
  res
    .status(200)
    .clearCookie('jid', {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'lax',
    })
    .json({ status: 'success', statusCode: 200, message: 'Signed Out successfully' });
});
