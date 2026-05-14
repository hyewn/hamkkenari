import { useEffect, useRef, useState } from "react";

export default function ChatFlowPage({
  questionNumber,
  questionText,
  stage,
  messages = [],
  finalAnswer = "",
  error = "",
  onNextIntro,
  onSendMessage,
  onChangeFinalAnswer,
  onSubmitAnswer,
}) {
  const [chatInput, setChatInput] = useState("");
  const messageEndRef = useRef(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    if (stage === "chat") {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, stage]);

  const handleSendChat = async () => {
    const trimmed = chatInput.trim();

    if (!trimmed) return;
    if (isSendingRef.current) return;

    isSendingRef.current = true;

    const userMessage = trimmed;

    // 먼저 입력창 비우기
    setChatInput("");

    // 부모에서 user 메시지를 먼저 추가하고,
    // 그 다음 GPT 응답을 messages에 추가해야 함
    await onSendMessage(userMessage);

    isSendingRef.current = false;
  };

  const handleChatKeyDown = (e) => {
    if (e.key !== "Enter") return;

    // 한글 입력 조합 중 Enter 중복 방지
    if (e.nativeEvent.isComposing) return;

    e.preventDefault();
    handleSendChat();
  };

  if (stage === "intro") {
    return (
      <main className="mobile-page">
        <section className="screen question-intro-screen">
          <h1 className="question-intro-title">
            질문 {questionNumber}.
            {"\n"}
            {questionText}
          </h1>

          <button className="question-dark-button" onClick={onNextIntro}>
            다음
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mobile-page">
      <section className="screen chat-assist-screen">
        <div className="chat-top-answer-box">
          <p className="chat-top-question">
            질문 {questionNumber}.
            <br />
            {questionText}
          </p>

          <div className="chat-top-answer-row">
            <input
              className="chat-top-answer-input"
              type="text"
              placeholder="답변을 입력하세요"
              value={finalAnswer}
              onChange={(e) => onChangeFinalAnswer(e.target.value)}
            />

            <button className="chat-top-answer-submit" onClick={onSubmitAnswer}>
              입력
            </button>
          </div>
        </div>

        <div className="chat-body">
          {messages.map((message, index) => (
            <div
              key={`${message.sender}-${index}`}
              className={`chat-card-row ${
                message.sender === "user" ? "user" : "bot"
              }`}
            >
              <div
                className={`chat-card ${
                  message.sender === "user"
                    ? "chat-card-user"
                    : "chat-card-bot"
                }`}
              >
                <div className="chat-card-text">{message.text}</div>
              </div>
            </div>
          ))}

          <div ref={messageEndRef} />
        </div>

        {error && <p className="error-text chat-error-text">{error}</p>}

        <div className="chat-footer">
          <input
            className="chat-fixed-input"
            type="text"
            placeholder="입력"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={handleChatKeyDown}
          />

          <button className="chat-send-text-button" onClick={handleSendChat}>
            전송
          </button>
        </div>
      </section>
    </main>
  );
}