import { Router } from "express";
import auth from "../middleware/auth.js";
import { requireHospital } from "../middleware/roleGuard.js";
import {
  getHospitalProfile, updateHospitalProfile, getHospitalRequests,
  getProxyRequests, confirmProxy, rejectProxy,
  getHospitalStaff, addStaff, removeStaff
} from "../controllers/hospital.controller.js";

const router = Router();
router.use(auth);
router.use(requireHospital);

router.get("/profile", getHospitalProfile);
router.patch("/profile", updateHospitalProfile);
router.get("/requests", getHospitalRequests);
router.get("/proxy-requests", getProxyRequests);
router.patch("/proxy/:proxyId/confirm", confirmProxy);
router.patch("/proxy/:proxyId/reject", rejectProxy);
router.get("/staff", getHospitalStaff);
router.post("/staff", addStaff);
router.delete("/staff/:staffId", removeStaff);

export default router;