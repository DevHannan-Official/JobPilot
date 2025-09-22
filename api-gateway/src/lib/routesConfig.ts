import { ENV } from './env.js';

export const routes = {
  v1: {
    auth: ENV.AUTH_SERVICE_URL,
    // jobs: 'http://localhost:5002',
    // users: 'http://localhost:5003',
  },
};
