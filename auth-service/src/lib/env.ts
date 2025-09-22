import dotenv from 'dotenv';

// Configuring dotenv to load environment variables from a .env file
dotenv.config();

// Centralized environment configuration
export const ENV = {
  ROOT_PORT: Number(process.env.ROOT_PORT) || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN as string,

  TOKENS_SECRET: process.env.TOKENS_SECRET as string,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as '30d' | '7d' | '1d',
  REFRESH_COOKIE_EXPIRES_IN_DAYS: Number(process.env.REFRESH_COOKIE_EXPIRES_IN_DAYS) || 30,

  REDIS_URL: process.env.REDIS_URL as string,
};
