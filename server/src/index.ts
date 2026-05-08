import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { salaryRoutes } from "./routes/salaries.route.ts";
import { errorHandler } from "./middlewares/error.middleware.ts";

dotenv.config({
  path: "./.env",
});
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/compensations", salaryRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Backend Running</h1>");
});

app.use(errorHandler);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.listen(5000, () => {
  console.log("The server is running on port 5000");
});
