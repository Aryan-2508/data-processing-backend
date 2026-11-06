import { Router } from "express";
import { getDashboard } from "../controllers/analytics.controller";
import validateRequest from "../middleware/validateRequest";
import { dashboardQuerySchema } from "../validators/analytics.validator";

const router = Router();

router.get(
    "/dashboard",
    validateRequest(dashboardQuerySchema),
    getDashboard
);

export default router;