import { type Request, type Response, type NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import asyncHandler from 'express-async-handler';
import ErrorHandler from '../lib/error-handler.js';
import {
  issueAccessToken,
  issueRefreshToken,
  issueResetPasswordToken,
  issueVerificationCode,
  verifyToken,
} from '../lib/token.js';
import { comparePassword, hashPassword, saveAccessToken } from '../lib/utils.js';
import { ENV } from '../lib/env.js';
import mailer from '../lib/mailer.js';
import { forgetPasswordMail, verifyMail } from '../lib/mail-templates.js';
import redis from '../lib/redis.js';

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

// /logout -> GET
export const logoutUser = asyncHandler((_req: Request, res: Response, _next: NextFunction) => {
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

// /me -> GET
export const authorizeUser = asyncHandler((req: Request, res: Response, _next: NextFunction) => {
  const user = req.user;
  user!.password = null;
  res
    .status(200)
    .json({ status: 'success', statusCode: 200, message: 'Authorized successfully', data: user });
});

// /refresh-token -> PATCH
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const jidCookie = req.cookies?.jid as string;
    const refreshToken =
      typeof jidCookie === 'string' && jidCookie.startsWith('Bearer ')
        ? jidCookie.split('Bearer ')[1]
        : undefined;

    if (!refreshToken) {
      next(new ErrorHandler('Unauthorized', 401));
      return;
    }

    const { userId } = verifyToken(refreshToken) as {
      userId: string;
    };
    if (typeof userId !== 'string') {
      next(new ErrorHandler('Unauthorized', 401));
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    user!.password = null;

    if (!user) {
      next(new ErrorHandler('Unauthorized', 401));
      return;
    }

    const accessToken = issueAccessToken();
    await saveAccessToken(accessToken, user.id);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Authorized successfully',
      data: user,
      accessToken,
    });
  }
);

// /forget-password -> POST
export const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as {
      email: string;
    };

    // Finding user, if it exists or not
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      next(new ErrorHandler('User not found', 404));
      return;
    }

    // creating a new reset token and saving it to redis
    const resetToken = issueResetPasswordToken();

    await redis.set(`resetPassword:${resetToken}`, user.id, 'EX', 15 * 60 /* 15 minutes */);

    setTimeout(() => {
      // sending the token via mail to user's email
      void mailer.sendMail({
        from: ENV.EMAIL_FROM,
        to: email,
        subject: 'Reset Password | JobPilot',
        html: forgetPasswordMail({
          token: resetToken,
          date: new Date().getFullYear().toString(),
        }),
      });
    }, 500);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'A mail with password reset link has been sent to your email address',
    });
  }
);

// /check-link -> GET
export const checkResetPasswordToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Getting token from params then validating it, that it is not expired or invalid
    const token = req.query.token as string;
    if (!token) {
      next(new ErrorHandler('Invalid or Expired Link', 401));
      return;
    }

    const userId = await redis.get(`resetPassword:${token}`);
    if (typeof userId !== 'string') {
      next(new ErrorHandler('Invalid or Expired Link', 401));
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      next(new ErrorHandler('Invalid or Expired Link', 404));
      return;
    }

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Valid Link',
    });
  }
);

// /reset-password -> PATCH
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.query.token as string;
    const { newPassword } = req.body as {
      newPassword: string;
    };

    const userId = await redis.get(`resetPassword:${token}`);
    if (typeof userId !== 'string') {
      next(new ErrorHandler('Invalid or Expired Link', 401));
      return;
    }

    // Hashing user's new password and updating it to database
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    // deleting the old token so that it can't be used again
    await redis.del(`resetPassword:${token}`);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Password reset successfully',
    });
  }
);

// /verify-email -> GET
export const sendVerificationCode = asyncHandler(
  async (req: Request, res: Response, _next: NextFunction) => {
    const user = req.user;

    // Checking if user is already verified or not?
    if (user?.isVerified) {
      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Your account is already verified',
      });
      return;
    }

    // Issueing a new account verification code and setting to redis
    // And sending mail to user's email
    const code = issueVerificationCode();

    await redis.set(`verificationCode:${user!.id}`, code, 'EX', 15 * 60 /* 15 minutes */);

    setTimeout(() => {
      // sending the token via mail to user's email
      void mailer.sendMail({
        from: ENV.EMAIL_FROM,
        to: user!.email,
        subject: 'Verification your Account | JobPilot',
        html: verifyMail({
          code,
          name: user!.name,
          date: new Date().getFullYear().toString(),
        }),
      });
    }, 500);

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'A mail with verification code has been sent to your email address',
    });
  }
);

// /verify-account -> PATCH
export const verifyAccount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body as {
      code: number;
    };

    // Checking if user is already verified or not?
    if (req.user?.isVerified) {
      res.status(200).json({
        status: 'success',
        statusCode: 200,
        message: 'Your account is already verified',
      });
      return;
    }

    // Checking if the verification is correct and not expired!
    const userId = await redis.get(`verificationCode:${req.user!.id}`);
    if (typeof userId !== 'string') {
      next(new ErrorHandler('Invalid or expired Code', 401));
      return;
    }

    if (userId !== code.toString()) {
      next(new ErrorHandler('Invalid or expired Code', 401));
      return;
    }

    // Updating user
    await prisma.user.update({
      where: {
        id: req.user!.id,
      },
      data: {
        isVerified: true,
      },
    });

    res.status(200).json({
      status: 'success',
      statusCode: 200,
      message: 'Account verified successfully',
    });
  }
);
