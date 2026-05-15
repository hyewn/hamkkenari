import supabase from "../lib/supabase.js";
import { findTableBySessionId } from "../lib/tableName.js";

export async function saveSurveyAnswers(req, res) {
  try {
    const { sessionId, answers } = req.body;

    const tableName = await findTableBySessionId(sessionId);

    const { error } = await supabase
      .from(tableName)
      .update(answers)
      .eq("id", sessionId);

    if (error) throw error;

    return res.status(200).json({ message: "설문 저장 완료" });
  } catch (error) {
    console.error("SAVE SURVEY ERROR:", error);
    return res.status(500).json({ error: "설문 저장 실패" });
  }
}