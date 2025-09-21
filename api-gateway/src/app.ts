import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import morgan from "morgan";

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
app.use(morgan("combined"));

app.get("/", (_, res) => {
  res.send("Hello from API Gateway!");
});

app.use(errorMiddleware);

export default app;
