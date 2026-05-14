import { useEffect, useState } from "react";

import LoginPage from "./pages/LoginPage";
import ConsentPage from "./pages/ConsentPage";
import GuidePage from "./pages/GuidePage";
import SurveyPage from "./pages/SurveyPage";
import ChatFlowPage from "./pages/ChatFlowPage";

import {
  PRE_SURVEY_PAGES,
  CHAT_QUESTIONS,
  POST_SURVEY_PAGES,
} from "./data/surveyData";

import {
  startSessionApi,
  updateProfileApi,
  saveSurveyAnswersApi,
  saveChatMessagesApi,
  saveChatFinalAnswerApi,
  saveChatQuestionStartApi,
  submitSessionApi,
} from "./lib/api";

import { sendSpecialChat } from "./lib/chatApi";

export default function App() {
  const [page, setPage] = useState("login");

  const [sessionId, setSessionId] = useState(null);

  const [loginName, setLoginName] = useState("");
  const [loginBirth, setLoginBirth] = useState("");

  const [agreed, setAgreed] = useState(false);
  const [consentName, setConsentName] = useState("");
  const [consentBirth, setConsentBirth] = useState("");
  const [gender, setGender] = useState("");

  const [preSurveyStep, setPreSurveyStep] = useState(0);
  const [postSurveyStep, setPostSurveyStep] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState({});

  const [chatIndex, setChatIndex] = useState(0);
  const [chatStage, setChatStage] = useState("intro");

  const [chatMessagesByQuestion, setChatMessagesByQuestion] = useState({});
  const [chatFinalAnswers, setChatFinalAnswers] = useState({});

  const [error, setError] = useState("");

  // 페이지 이동 시 항상 맨 위로
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [page, preSurveyStep, postSurveyStep, chatIndex, chatStage]);

  const currentMessages = chatMessagesByQuestion[chatIndex] || [];
  const currentFinalAnswer = chatFinalAnswers[chatIndex] || "";

  const validateQuestions = (questions) => {
    return questions.every((question) => {
      const value = surveyAnswers[question.key];

      return value !== undefined && String(value).trim() !== "";
    });
  };

  const handleLoginNext = () => {
    setError("");

    if (!loginName.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }

    if (!loginBirth.trim()) {
      setError("생년월일을 입력해 주세요.");
      return;
    }

    setConsentName(loginName);
    setConsentBirth(loginBirth);

    setPage("consent");
  };

  const handleConsentNext = async () => {
    setError("");

    if (!agreed) {
      setError("연구 참여 동의가 필요합니다.");
      return;
    }

    if (!consentName.trim()) {
      setError("이름을 입력해 주세요.");
      return;
    }

    if (!gender) {
      setError("성별을 선택해 주세요.");
      return;
    }

    if (!consentBirth.trim()) {
      setError("생년월일을 입력해 주세요.");
      return;
    }

    try {
      const result = await startSessionApi({
        name: loginName,
        birth: loginBirth,
      });

      setSessionId(result.sessionId);

      await updateProfileApi(result.sessionId, {
        name: consentName,
        birth: consentBirth,
        gender,
        agreed,
      });

      setPage("preSurvey");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChangeSurveyAnswer = (key, value) => {
    setSurveyAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePreSurveyNext = async () => {
    const currentPage = PRE_SURVEY_PAGES[preSurveyStep];

    setError("");

    if (!validateQuestions(currentPage.questions)) {
      setError("모든 문항에 응답해 주세요.");
      return;
    }

    if (preSurveyStep < PRE_SURVEY_PAGES.length - 1) {
      setPreSurveyStep((prev) => prev + 1);
      return;
    }

    try {
      await saveSurveyAnswersApi({
        sessionId,
        type: "pre",
        answers: surveyAnswers,
      });

      setPage("guide");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePreSurveyPrev = () => {
    setError("");

    if (preSurveyStep > 0) {
      setPreSurveyStep((prev) => prev - 1);
      return;
    }

    setPage("consent");
  };

  const handleStartChatQuestion = async () => {
    setError("");

    try {
      await saveChatQuestionStartApi({
        sessionId,
        questionNumber: chatIndex + 1,
      });
    } catch (err) {
      console.error(err);
    }

    setChatStage("chat");
  };

  const handleSendMessage = async (message) => {
    const trimmed = message.trim();

    if (!trimmed) return;

    const userMessage = {
      sender: "user",
      text: trimmed,
    };

    const prevMessages = chatMessagesByQuestion[chatIndex] || [];

    setChatMessagesByQuestion((prev) => ({
      ...prev,
      [chatIndex]: [...prevMessages, userMessage],
    }));

    try {
      await saveChatMessagesApi({
        sessionId,
        questionNumber: chatIndex + 1,
        role: "user",
        content: trimmed,
      });

      const reply = await sendSpecialChat(trimmed);

      const botMessage = {
        sender: "bot",
        text: reply,
      };

      setChatMessagesByQuestion((prev) => ({
        ...prev,
        [chatIndex]: [...(prev[chatIndex] || []), botMessage],
      }));

      await saveChatMessagesApi({
        sessionId,
        questionNumber: chatIndex + 1,
        role: "bot",
        content: reply,
      });
    } catch (err) {
      const errorBotMessage = {
        sender: "bot",
        text: "챗봇 응답 중 오류가 발생했습니다.",
      };

      setChatMessagesByQuestion((prev) => ({
        ...prev,
        [chatIndex]: [...(prev[chatIndex] || []), errorBotMessage],
      }));
    }
  };

  const handleChangeFinalAnswer = (value) => {
    setChatFinalAnswers((prev) => ({
      ...prev,
      [chatIndex]: value,
    }));
  };

  const handleSubmitChatAnswer = async () => {
    setError("");

    const answer = currentFinalAnswer.trim();

    if (!answer) {
      setError("답변을 입력해 주세요.");
      return;
    }

    try {
      await saveChatFinalAnswerApi({
        sessionId,
        questionNumber: chatIndex + 1,
        answer,
      });

      if (chatIndex < CHAT_QUESTIONS.length - 1) {
        setChatIndex((prev) => prev + 1);
        setChatStage("intro");
        return;
      }

      setPage("postSurvey");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePostSurveyNext = async () => {
    const currentPage = POST_SURVEY_PAGES[postSurveyStep];

    setError("");

    if (!validateQuestions(currentPage.questions)) {
      setError("모든 문항에 응답해 주세요.");
      return;
    }

    if (postSurveyStep < POST_SURVEY_PAGES.length - 1) {
      setPostSurveyStep((prev) => prev + 1);
      return;
    }

    try {
      await saveSurveyAnswersApi({
        sessionId,
        type: "post",
        answers: surveyAnswers,
      });

      await submitSessionApi(sessionId);

      setPage("complete");
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePostSurveyPrev = () => {
    setError("");

    if (postSurveyStep > 0) {
      setPostSurveyStep((prev) => prev - 1);
      return;
    }

    setPage("chat");
  };

  if (page === "login") {
    return (
      <LoginPage
        loginName={loginName}
        loginBirth={loginBirth}
        error={error}
        onChangeName={setLoginName}
        onChangeBirth={setLoginBirth}
        onNext={handleLoginNext}
      />
    );
  }

  if (page === "consent") {
    return (
      <ConsentPage
        agreed={agreed}
        consentName={consentName}
        gender={gender}
        consentBirth={consentBirth}
        error={error}
        onChangeAgreed={setAgreed}
        onChangeName={setConsentName}
        onChangeGender={setGender}
        onChangeBirth={setConsentBirth}
        onNext={handleConsentNext}
      />
    );
  }

  if (page === "preSurvey") {
    const currentPage = PRE_SURVEY_PAGES[preSurveyStep];

    return (
      <SurveyPage
        title={currentPage.title}
        questions={currentPage.questions}
        answers={surveyAnswers}
        error={error}
        onChangeAnswer={handleChangeSurveyAnswer}
        onPrev={handlePreSurveyPrev}
        onNext={handlePreSurveyNext}
        showPrev={true}
      />
    );
  }

  if (page === "guide") {
    return <GuidePage guideId="guide1" onNext={() => setPage("chat")} />;
  }

  if (page === "chat") {
    return (
      <ChatFlowPage
        questionNumber={chatIndex + 1}
        totalQuestions={CHAT_QUESTIONS.length}
        questionText={CHAT_QUESTIONS[chatIndex]}
        stage={chatStage}
        messages={currentMessages}
        finalAnswer={currentFinalAnswer}
        error={error}
        onNextIntro={handleStartChatQuestion}
        onSendMessage={handleSendMessage}
        onChangeFinalAnswer={handleChangeFinalAnswer}
        onSubmitAnswer={handleSubmitChatAnswer}
      />
    );
  }

  if (page === "postSurvey") {
    const currentPage = POST_SURVEY_PAGES[postSurveyStep];

    return (
      <SurveyPage
        title={currentPage.title}
        questions={currentPage.questions}
        answers={surveyAnswers}
        error={error}
        onChangeAnswer={handleChangeSurveyAnswer}
        onPrev={handlePostSurveyPrev}
        onNext={handlePostSurveyNext}
        isFinal={postSurveyStep === POST_SURVEY_PAGES.length - 1}
        showPrev={true}
      />
    );
  }

  if (page === "complete") {
    return (
      <main className="mobile-page">
        <section className="screen complete-screen">
          <div className="complete-message-wrap">
            <h1 className="complete-title">
              모든 설문이 완료되었습니다.
            </h1>

            <p className="complete-description">
              연구에 참여해주셔서 감사합니다.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return null;
}