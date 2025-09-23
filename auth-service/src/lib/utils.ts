import argon from 'argon2';
import redis from './redis.js';

export const hashPassword = async (password: string) => {
  const hashedPassword = await argon.hash(password, { salt: Buffer.alloc(16) });
  return hashedPassword;
};

export const comparePassword = async (password: string, hashedPassword: string) => {
  const isValid = await argon.verify(hashedPassword, password);
  return isValid;
};

export const saveAccessToken = async (accessToken: string, userId: string) => {
  try {
    const key = `accessToken:${accessToken}`;
    await redis.set(key, userId, 'EX', 15 * 60 /* 15 minutes */);
  } catch (error) {
    console.error(error);
  }
};
