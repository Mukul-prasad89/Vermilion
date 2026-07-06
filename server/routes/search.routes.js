import { Router } from "express";
import auth from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { searchBlood, escalateSearch } from "../controllers/search.controller.js";
import { escalateSearchSchema } from "../validators/search.validator.js";

const router = Router();
router.use(auth);

router.get("/blood", searchBlood);
router.post("/escalate", validate(escalateSearchSchema), escalateSearch);

export default router;