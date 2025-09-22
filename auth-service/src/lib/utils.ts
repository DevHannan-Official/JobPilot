import argon from 'argon2';
import redis from './redis.js';

export const hashPassword = async (password: string) => {
  const hashedPassword = await argon.hash(password, { salt: Buffer.alloc(16) });
  return hashedPassword;
};

export const saveAccessToken = async (accessToken: string, userId: string) => {
  try {
    const key = `accessToken:${userId}`;
    await redis.set(key, accessToken, 'EX', 15 * 60 /* 15 minutes */);
  } catch (error) {
    console.error(error);
  }
};
