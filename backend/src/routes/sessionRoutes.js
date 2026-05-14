import express from "express";
import {
  startSession,
  updateProfile,
  submitSession,
} from "../controllers/sessionController.js";

const router = express.Router();

router.post("/start", startSession);
router.patch("/:sessionId/profile", updateProfile);
router.post("/:sessionId/submit", submitSession);

export default router;