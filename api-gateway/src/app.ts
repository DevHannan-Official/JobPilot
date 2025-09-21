import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ENV } from './lib/env.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { errorMiddleware } from './middlewares/error.middleware.js';
import morgan from 'morgan';
import proxy from 'express-http-proxy';

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
app.use(morgan('combined'));
app.set('trust proxy', 1);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello from API Gateway!');
});

app.use('/api/auth', proxy(ENV.AUTH_SERVICE_URL));

app.use(errorMiddleware);

export default app;
