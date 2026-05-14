const BASE_URL = "http://localhost:4000";

export async function sendSpecialChat(message) {
  const res = await fetch(`${BASE_URL}/api/chat/special`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("챗봇 요청 실패");
  }

  const data = await res.json();
  return data.reply;
}