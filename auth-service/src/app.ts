import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth-routes.js';

const app = express();

app.use(
  cors({
    origin: ENV.CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use('/api', authRoutes);

app.use(errorMiddleware);

export default app;
