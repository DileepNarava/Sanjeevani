import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import { searchDonors } from "../controllers/donor.controller.js";

const router = express.Router();

router.get("/search", authMiddleware, searchDonors);

export default router;