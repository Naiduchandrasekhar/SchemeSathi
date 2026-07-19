import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/schemes.js";
import { initDb } from "./database/init.js";

const app = express();

// Trust reverse proxy (e.g. Render, Heroku) for express-rate-limit to read X-Forwarded-For header
app.set("trust proxy", 1);

app.use(helmet());

const allowedOrigins = [
  "http://localhost:5173",
  "https://tubular-wisp-c99977.netlify.app",
];

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://tubular-wisp-c99977.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000, 
    max: 100,
  }),
  routes
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SchemeSathi API is running",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initDb();
});