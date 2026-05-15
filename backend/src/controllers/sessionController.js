import supabase from "../lib/supabase.js";
import { getTableName, findTableBySessionId } from "../lib/tableName.js";

export async function startSession(req, res) {
  try {
    const { name, birth, chatbotType } = req.body;

    const tableName = getTableName(chatbotType);

    const { data, error } = await supabase
      .from(tableName)
      .insert({
        login_name: name,
        login_birth: birth,
      })
      .select("id")
      .single();

    if (error) throw error;

    return res.status(201).json({
      sessionId: data.id,
    });
  } catch (error) {
    console.error("START SESSION ERROR:", error);
    return res.status(500).json({ error: "세션 생성 실패" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { sessionId } = req.params;
    const { name, birth, gender, agreed } = req.body;

    const tableName = await findTableBySessionId(sessionId);

    const { error } = await supabase
      .from(tableName)
      .update({
        consent_name: name,
        consent_birth: birth,
        gender,
        agreed,
      })
      .eq("id", sessionId);

    if (error) throw error;

    return res.status(200).json({ message: "프로필 저장 완료" });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ error: "프로필 저장 실패" });
  }
}

export async function submitSession(req, res) {
  try {
    const { sessionId } = req.params;

    const tableName = await findTableBySessionId(sessionId);

    const { data, error: readError } = await supabase
      .from(tableName)
      .select("started_at")
      .eq("id", sessionId)
      .single();

    if (readError) throw readError;

    const submittedAt = new Date();
    const startedAt = data.started_at ? new Date(data.started_at) : submittedAt;

    const totalDurationSeconds = Math.floor(
      (submittedAt.getTime() - startedAt.getTime()) / 1000
    );

    const { error } = await supabase
      .from(tableName)
      .update({
        submitted_at: submittedAt.toISOString(),
        total_duration_seconds: totalDurationSeconds,
      })
      .eq("id", sessionId);

    if (error) throw error;

    return res.status(200).json({ message: "제출 완료" });
  } catch (error) {
    console.error("SUBMIT SESSION ERROR:", error);
    return res.status(500).json({ error: "제출 실패" });
  }
}