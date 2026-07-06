import { Router } from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { locationLimiter, nearbyLimiter } from "../middleware/rateLimiter.js";
import { updateLocation, getNearby, trackDonors, donorArrivedAtHospital } from "../controllers/tracking.controller.js";
import { locationUpdateSchema, nearbyDonorsSchema } from "../validators/tracking.validator.js";

const router = Router();
router.use(auth);

router.post("/location", validate(locationUpdateSchema), locationLimiter, updateLocation);
router.get("/nearby", getNearby);
router.get("/donors/:requestId", trackDonors);
router.patch("/arrived/:requestId", donorArrivedAtHospital);

export default router;