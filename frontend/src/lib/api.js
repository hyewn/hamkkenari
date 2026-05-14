const BASE_URL = import.meta.env.VITE_BASE_URL;

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "요청 처리 중 오류가 발생했습니다.");
  }

  return data;
}

export async function startSessionApi({ name, birth }) {
  return request("/api/sessions/start", {
    method: "POST",
    body: JSON.stringify({ name, birth }),
  });
}

export async function updateProfileApi(sessionId, payload) {
  return request(`/api/sessions/${sessionId}/profile`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function saveSurveyAnswersApi(payload) {
  return request("/api/surveys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveChatMessagesApi(payload) {
  return request("/api/chat/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function saveChatFinalAnswerApi(payload) {
  return request("/api/chat/final-answer", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function submitSessionApi(sessionId) {
  return request(`/api/sessions/${sessionId}/submit`, {
    method: "POST",
  });
}

export async function saveChatQuestionStartApi(payload) {
  return request("/api/chat/start", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}