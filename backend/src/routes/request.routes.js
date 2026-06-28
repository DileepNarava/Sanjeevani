import express from "express";

import authMiddleware from "../middleware/auth.middleware.js";

import {
  createRequest,
  getAllRequests,
  getMyRequests,
  deleteRequest,
} from "../controllers/request.controller.js";

const router = express.Router();

router.post("/", authMiddleware, createRequest);

router.get("/", getAllRequests);

router.get("/my", authMiddleware, getMyRequests);

router.delete("/:id", authMiddleware, deleteRequest);

export default router;