import jwt from 'jsonwebtoken';
import { ENV } from './env.js';
import crypto from 'crypto';

export const issueRefreshToken = (userId: string) => {
  const refreshToken = jwt.sign({ userId }, ENV.TOKENS_SECRET, {
    expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN,
  });
  return refreshToken;
};
export const issueAccessToken = () => {
  const accessToken = crypto.randomBytes(64).toString('hex');
  return accessToken;
};

export const issueResetPasswordToken = (userId: string) => {
  const resetPasswordToken = jwt.sign({ userId }, ENV.TOKENS_SECRET, {
    expiresIn: '15m',
  });
  return resetPasswordToken;
};

export const verifyToken = (token: string) => {
  const decoded = jwt.verify(token, ENV.TOKENS_SECRET);
  return decoded;
};
