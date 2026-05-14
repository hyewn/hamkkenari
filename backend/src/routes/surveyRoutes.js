import express from "express";
import { saveSurveyAnswers } from "../controllers/surveyController.js";

const router = express.Router();

router.post("/", saveSurveyAnswers);

export default router;