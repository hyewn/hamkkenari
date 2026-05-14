import supabase from "../lib/supabase.js";

export async function saveChatQuestionStart(req, res) {
  try {
    const { sessionId, questionNumber } = req.body;

    const column = `chat_q${questionNumber}_started_at`;

    const { error } = await supabase
      .from("participant_results")
      .update({
        [column]: new Date().toISOString(),
      })
      .eq("id", sessionId);

    if (error) throw error;

    return res.status(200).json({ message: "챗봇 질문 시작 시간 저장 완료" });
  } catch (error) {
    console.error("SAVE CHAT START ERROR:", error);
    return res.status(500).json({ error: "챗봇 시작 시간 저장 실패" });
  }
}

export async function saveChatFinalAnswer(req, res) {
  try {
    const { sessionId, questionNumber, answer } = req.body;

    const startColumn = `chat_q${questionNumber}_started_at`;
    const endColumn = `chat_q${questionNumber}_ended_at`;
    const durationColumn = `chat_q${questionNumber}_duration_seconds`;
    const answerColumn = `chat_q${questionNumber}_answer`;

    const { data, error: readError } = await supabase
      .from("participant_results")
      .select(startColumn)
      .eq("id", sessionId)
      .single();

    if (readError) throw readError;

    const endedAt = new Date();
    const startedAt = data[startColumn] ? new Date(data[startColumn]) : endedAt;

    const durationSeconds = Math.floor(
      (endedAt.getTime() - startedAt.getTime()) / 1000
    );

    const { error } = await supabase
      .from("participant_results")
      .update({
        [endColumn]: endedAt.toISOString(),
        [durationColumn]: durationSeconds,
        [answerColumn]: answer,
      })
      .eq("id", sessionId);

    if (error) throw error;

    return res.status(200).json({ message: "최종 답변 저장 완료" });
  } catch (error) {
    console.error("SAVE FINAL ANSWER ERROR:", error);
    return res.status(500).json({ error: "최종 답변 저장 실패" });
  }
}

// 대화 로그는 최종 wide table에는 저장 안 함.
// 필요하면 console만 남김.
export async function saveChatMessages(req, res) {
  return res.status(200).json({ message: "채팅 메시지 로그 저장 생략" });
}