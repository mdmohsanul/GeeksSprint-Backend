import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, // Allow cookies,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

// middleware for json data
app.use(express.json({ limit: "16kb" }));

// if data come from URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// to read and set cookie to browser
app.use(cookieParser());

// ---------- routes -------------------

import userRouter from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter);

app.use(errorHandler);
export { app };