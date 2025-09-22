import { Redis } from 'ioredis';
import { ENV } from './env.js';

const redis = new Redis(ENV.REDIS_URL);

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (error) => {
  console.log('Error connecting to redis due to', error);
  process.exit(1);
});

export default redis;
