import express from "express";
import openai from "../lib/openai.js";

import {
  saveChatMessages,
  saveChatFinalAnswer,
  saveChatQuestionStart,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/special", async (req, res) => {
  try {
    const { message, chatbotType } = req.body;

    const isSimple = chatbotType === "simple";
    const model = isSimple
      ? process.env.SIMPLE_MODEL
      : process.env.EXPLAIN_MODEL;

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: message }],
      max_tokens: isSimple ? 250 : 700,
    });

    const reply =
      response.choices?.[0]?.message?.content || "응답을 생성하지 못했습니다.";

    return res.json({ reply });
  } catch (error) {
    console.error("SPECIAL BOT ERROR:", error);
    return res.status(500).json({ error: "챗봇 오류" });
  }
});

router.post("/start", saveChatQuestionStart);
router.post("/messages", saveChatMessages);
router.post("/final-answer", saveChatFinalAnswer);

export default router;