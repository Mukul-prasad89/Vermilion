import { Router } from "express";
import auth from "../middleware/auth.js";
import { requireAnyRole } from "../middleware/roleGuard.js";
import { getVerificationQueue, verifyDocument, syncVerificationStatus, getPlatformStats } from "../controllers/admin.controller.js";

const router = Router();
router.use(auth);

router.get("/stats", getPlatformStats);
router.get("/verifications", getVerificationQueue);
router.patch("/verifications/:docId", verifyDocument);
router.patch("/sync-verification/:profileId", syncVerificationStatus);

export default router;