import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import ErrorHandler from "./lib/error-handler.js";

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

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  next(new ErrorHandler("Test Error", 500));
});

app.use(errorMiddleware);

export default app;
