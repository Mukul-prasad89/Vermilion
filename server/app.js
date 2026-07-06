import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "./config/env.js";
import { corsOptions } from "./config/cors.js";
import { standardLimiter } from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import requestRoutes from "./routes/request.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";
import searchRoutes from "./routes/search.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan("short"));
app.use(express.json());
app.use(standardLimiter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/hospital", hospitalRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

export default app;