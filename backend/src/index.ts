import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "https://lets-cook.onrender.com",
    credentials: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/recipes", recipeRoutes);

app
  .listen(PORT)
  .on("listening", () => {
    console.log(`\n***Server is listening on ${PORT}***\n`);
  })
  .on("error", (err: any) => {
    console.error("Port bind failed:", err.message);
    process.exit(1);
  });
