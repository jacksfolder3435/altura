import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { config, isDatabaseConfigured } from "./config.js";
import { profileRouter } from "./routes/profile.js";
import { shareRouter } from "./routes/share.js";

const app = express();

app.use(express.json({ limit: "100kb" }));

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl, server-to-server
      if (config.allowedOrigins.length === 0) return cb(null, true);
      if (config.allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
  }),
);

// Per-IP rate limit on the API
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/health", (_req, res) => {
  res.json({ ok: true, env: config.nodeEnv, db: isDatabaseConfigured });
});

app.use("/api", profileRouter);
app.use("/api", shareRouter);

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Altura backend listening on :${config.port}`);
});
