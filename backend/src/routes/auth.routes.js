import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

console.log("AUTH ROUTES LOADED");

import {
  register,
  login,
  getCurrentUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getCurrentUser);

export default router;