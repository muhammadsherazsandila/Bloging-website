import express from "express";
import { mainRouter } from "./routes/mainRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { postsRouter } from "./routes/postsRouter.js";
import "./db/mongooseConnection.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // Create React App
  "https://blogorablogs.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);
app.use("/user", userRouter);
app.use("/post", postsRouter);

app.listen(5000, () => console.log("Server is running on port 5000"));
export default app;
