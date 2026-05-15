const BASE_URL = import.meta.env.VITE_BASE_URL;
const CHATBOT_TYPE = import.meta.env.VITE_CHATBOT_TYPE || "explain";

export async function sendSpecialChat(message) {
  const res = await fetch(`${BASE_URL}/api/chat/special`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      chatbotType: CHATBOT_TYPE,
    }),
  });

  if (!res.ok) {
    throw new Error("챗봇 요청 실패");
  }

  const data = await res.json();
  return data.reply;
}