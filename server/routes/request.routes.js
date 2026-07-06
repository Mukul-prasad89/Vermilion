import { Router } from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { requestLimiter } from "../middleware/rateLimiter.js";
import { raiseRequest, getRequest, cancelRequest, markFulfilled } from "../controllers/request.controller.js";
import { raiseRequestSchema } from "../validators/request.validator.js";
import { requireHospital } from "../middleware/roleGuard.js";

const router = Router();
router.use(auth);

router.post("/raise", validate(raiseRequestSchema), requestLimiter, raiseRequest);
router.get("/:requestId", getRequest);
router.patch("/:requestId/cancel", cancelRequest);
router.patch("/:requestId/fulfilled", requireHospital, markFulfilled);

export default router;