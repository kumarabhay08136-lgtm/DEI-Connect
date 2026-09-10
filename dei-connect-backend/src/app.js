import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import path from "node:path";

import apiRouter from "./routes/index.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// --- Security & performance middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(mongoSanitize()); // strips $ / . operators from user input to block NoSQL injection

if (process.env.NODE_ENV !== "test") {
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
}

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Uploaded avatars/covers/posts/resources are served as plain static files.
// NOTE: only /uploads is public — it holds non-sensitive media (avatars,
// covers, post/resource files). Nothing that contains private user data
// (profile fields, mail, chat, etc.) is ever served statically; that all
// lives in MongoDB and only reaches a client through an authenticated route.
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (_req, res) => {
  res.json({ name: "DEI Connect API", status: "running" });
});

app.use("/api", apiRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
