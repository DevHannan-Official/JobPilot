import dotenv from 'dotenv';

// Configuring dotenv to load environment variables from a .env file
dotenv.config();

// Centralized environment configuration
export const ENV = {
  ROOT_PORT: Number(process.env.ROOT_PORT) || 5000,
  NODE_ENV: (process.env.NODE_ENV as string) || 'development',

  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN as string,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL as string,
};
