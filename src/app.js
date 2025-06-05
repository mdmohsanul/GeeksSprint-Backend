import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, // Allow cookies,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// middleware for json data
app.use(express.json({ limit: "16kb" }));

// if data come from URL
app.use(express.urlencoded({ extended: true, limit: "16kb" }));


// to read and set cookie to browser
app.use(cookieParser());

// ---------- routes -------------------

import userRouter from "./routes/user.routes.js";
import projectRouter from "./routes/project.routes.js";
import assignmentRouter from "./routes/assignment.routes.js";
import authRouter from "./routes/auth.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/assignments", assignmentRouter);


app.use(errorHandler);
export { app };