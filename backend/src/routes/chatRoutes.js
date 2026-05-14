import express from "express";
import openai from "../lib/openai.js";
import {
  saveChatMessages,
  saveChatFinalAnswer,
  saveChatQuestionStart,
} from "../controllers/chatController.js";

const router = express.Router();

const MODEL = "ft:gpt-4o-2024-08-06:personal:chatbot:Da1FmtGe";

router.post("/special", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "메시지를 입력해 주세요." });
    }

    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "너는 암 관련 의료 정보를 따뜻하고 이해하기 쉽게 설명하는 챗봇이야. 단, 진단이나 처방처럼 의사의 판단이 필요한 내용은 병원 상담이 필요하다고 안내해.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 700,
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "응답을 생성하지 못했습니다.";

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