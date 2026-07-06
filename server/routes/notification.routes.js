import { Router } from "express";
import auth from "../middleware/auth.js";
import { getNotifications, markRead, markAllRead, getUnreadCount } from "../controllers/notification.controller.js";

const router = Router();
router.use(auth);

router.get("/", getNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markRead);
router.patch("/read-all", markAllRead);

export default router;