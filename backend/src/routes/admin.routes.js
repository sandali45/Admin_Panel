import { Router } from "express";
import { requireAdmin } from "../middleware/require-admin.js";
import * as controller from "../controllers/admin.controller.js";

const router = Router();

router.use(requireAdmin);

router.get("/dashboard", controller.getDashboard);

router.get("/users", controller.getUsers);
router.patch("/users/:id/status", controller.updateUserStatus);

router.get("/workers", controller.getWorkers);
router.patch("/workers/:id/approve", controller.approveWorker);
router.patch("/workers/:id/reject", controller.rejectWorker);

router.get("/bookings", controller.getBookings);

router.get("/services", controller.getServices);
router.patch("/services/:id/toggle", controller.toggleService);

router.get("/settings/commission", controller.getCommission);
router.put("/settings/commission", controller.updateCommission);

export default router;
