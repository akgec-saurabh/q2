import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT } from "./constants.js";
import userRoutes from "./routes/user.routes.js";
import preferenceRoutes from "./routes/preference.routes.js";
import dataRoutes from "./routes/data.routes.js";
import { ApiError } from "./utils/ApiError.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: LIMIT }));
app.use(urlencoded({ extended: true, limit: LIMIT }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/preference", preferenceRoutes);
app.use("/api/v1/data", dataRoutes);

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const response =
    err instanceof ApiError
      ? err.getResponse()
      : {
          success: false,
          statusCode,
          message: "Internal Server Error",
          errors: [],
          data: null,
        };

  res.status(statusCode).json(response);
};

app.use(errorHandler);

export { app };
