import { Router } from "express";
import auth from "../middleware/auth.js";
import { refreshSession, logout, registerDeviceToken } from "../controllers/auth.controller.js";
import { standardLimiter } from "../middleware/rateLimiter.js";

const router = Router();

router.post("/refresh", refreshSession);
router.post("/logout", auth, logout);
router.post("/device-token", auth, registerDeviceToken);

export default router;