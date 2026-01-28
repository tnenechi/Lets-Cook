import express from "express";
import {
  register,
  login,
  logOut,
  getUser,
  refreshToken,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logOut);
router.post("/refresh", refreshToken);
router.get("/me", authenticateUser, getUser);

export default router;
