import supabase from "../lib/supabase.js";

export async function startSession(req, res) {
  try {
    const { name, birth } = req.body;

    const { data, error } = await supabase
      .from("participant_results")
      .insert({
        login_name: name,
        login_birth: birth,
      })
      .select("id")
      .single();

    if (error) throw error;

    return res.status(201).json({ sessionId: data.id });
  } catch (error) {
    console.error("START SESSION ERROR:", error);
    return res.status(500).json({ error: "세션 생성 실패" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { sessionId } = req.params;
    const { name, birth, gender, agreed } = req.body;

    const { error } = await supabase
      .from("participant_results")
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

    const { data, error: readError } = await supabase
      .from("participant_results")
      .select("started_at")
      .eq("id", sessionId)
      .single();

    if (readError) throw readError;

    const submittedAt = new Date();
    const startedAt = new Date(data.started_at);

    const totalDurationSeconds = Math.floor(
      (submittedAt.getTime() - startedAt.getTime()) / 1000
    );

    const { error } = await supabase
      .from("participant_results")
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