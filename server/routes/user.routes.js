import { Router } from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { requireDonor } from "../middleware/roleGuard.js";
import { responseLimiter } from "../middleware/rateLimiter.js";
import {
  getProfile, updateUserProfile, registerDonor, toggleAvailability,
  getDonorAlerts, getDonationHistory, getDonorBadges, updateDonorSettings,
  getMySearches, getMyRequests, respondToRequest
} from "../controllers/user.controller.js";
import {
  registerDonorSchema, toggleAvailabilitySchema, updateDonorSettingsSchema,
  respondToRequestSchema, updateProfileSchema
} from "../validators/user.validator.js";

const router = Router();
router.use(auth);

router.get("/profile", getProfile);
router.patch("/profile", validate(updateProfileSchema), updateUserProfile);
router.post("/register-donor", validate(registerDonorSchema), registerDonor);
router.patch("/donor-availability", validate(toggleAvailabilitySchema), toggleAvailability);
router.patch("/donor-settings", requireDonor, validate(updateDonorSettingsSchema), updateDonorSettings);
router.get("/donor-alerts", requireDonor, getDonorAlerts);
router.get("/donation-history", requireDonor, getDonationHistory);
router.get("/donor-badges", requireDonor, getDonorBadges);
router.get("/searches", getMySearches);
router.get("/requests", getMyRequests);
router.post("/respond/:requestId", requireDonor, validate(respondToRequestSchema), responseLimiter, respondToRequest);

export default router;