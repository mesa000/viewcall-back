import { Router } from "express";

import userRoutes from "./firebaseRoutes";

const router = Router();

/**
 * Register domain-specific route modules.
 *
 * All routes below are mounted from `src/index.ts` under `/api/v1`.
 */
router.use("/users", userRoutes);


export default router;
