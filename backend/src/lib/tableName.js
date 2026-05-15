import supabase from "./supabase.js";

export function getTableName(chatbotType) {
  return chatbotType === "simple"
    ? "participant_results_simple"
    : "participant_results_explain";
}

export async function findTableBySessionId(sessionId) {
  const { data: explainData, error: explainError } = await supabase
    .from("participant_results_explain")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle();

  if (explainError) throw explainError;
  if (explainData) return "participant_results_explain";

  const { data: simpleData, error: simpleError } = await supabase
    .from("participant_results_simple")
    .select("id")
    .eq("id", sessionId)
    .maybeSingle();

  if (simpleError) throw simpleError;
  if (simpleData) return "participant_results_simple";

  throw new Error("해당 sessionId를 찾을 수 없습니다.");
}