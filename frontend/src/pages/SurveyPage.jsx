export default function SurveyPage({
  title,
  questions,
  answers,
  error,
  onChangeAnswer,
  onPrev,
  onNext,
  isFinal = false,
  showPrev = true,
}) {
  const getQuestionKey = (question) => question.key || question.id;

  const getQuestionTitle = (question) => {
    return question.title || question.text || "";
  };

  const renderScale = (question) => {
    const key = getQuestionKey(question);
    const min = question.min ?? 1;
    const max = question.max ?? 5;

    const numbers = Array.from(
      { length: max - min + 1 },
      (_, index) => min + index
    );

    if (max === 10) {
      const isLowHigh = question.scaleLabelType === "lowHigh";

      return (
        <div className="scale-vertical-wrap">
          <div className="scale-edge-label">
            {isLowHigh ? "매우 낮다" : "전혀 그렇지 않다"}
          </div>

          {numbers.map((number) => (
            <label className="survey-option-row" key={number}>
              <input
                type="radio"
                name={key}
                value={String(number)}
                checked={String(answers[key]) === String(number)}
                onChange={(e) => onChangeAnswer(key, e.target.value)}
              />
              <span>{number}</span>
            </label>
          ))}

          <div className="scale-edge-label bottom">
            {isLowHigh ? "매우 높다" : "매우 그렇다"}
          </div>
        </div>
      );
    }

    const fivePointLabels = {
      1: "전혀 그렇지 않다",
      2: "그렇지 않다",
      3: "보통이다",
      4: "그렇다",
      5: "매우 그렇다",
    };

    return (
      <div className="vertical-scale">
        {numbers.map((number) => (
          <label className="survey-option-row" key={number}>
            <input
              type="radio"
              name={key}
              value={String(number)}
              checked={String(answers[key]) === String(number)}
              onChange={(e) => onChangeAnswer(key, e.target.value)}
            />
            <span>{fivePointLabels[number] || number}</span>
          </label>
        ))}
      </div>
    );
  };

  const renderSemanticScale = (question) => {
    const key = getQuestionKey(question);
    const min = question.min ?? 1;
    const max = question.max ?? 7;

    const numbers = Array.from(
      { length: max - min + 1 },
      (_, index) => min + index
    );

    return (
      <div className="semantic-scale-block">
        <div className="semantic-label-row">
          <span>{question.left}</span>
          <span>{question.right}</span>
        </div>

        <div className="semantic-option-row">
          {numbers.map((number) => (
            <label className="semantic-option" key={number}>
              <input
                type="radio"
                name={key}
                value={String(number)}
                checked={String(answers[key]) === String(number)}
                onChange={(e) => onChangeAnswer(key, e.target.value)}
              />
              <span>{number}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="mobile-page">
      <section className="screen survey-screen">
        {questions.map((question, index) => {
          const key = getQuestionKey(question);
          const questionTitle = getQuestionTitle(question);

          return (
            <div className="survey-question-card" key={key}>
              <p className="survey-question-text">
                {index + 1}. {questionTitle}
              </p>

              {question.type === "text" && (
                <input
                  className="line-input"
                  type="text"
                  placeholder="단답형 텍스트"
                  value={answers[key] || ""}
                  onChange={(e) => onChangeAnswer(key, e.target.value)}
                />
              )}

              {question.type === "radio" &&
                question.options.map((option) => (
                  <label className="survey-option-row" key={option}>
                    <input
                      type="radio"
                      name={key}
                      value={option}
                      checked={answers[key] === option}
                      onChange={(e) => onChangeAnswer(key, e.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}

              {question.type === "scale" && renderScale(question)}

              {question.type === "semantic" && renderSemanticScale(question)}
            </div>
          );
        })}

        {error && <p className="error-text survey-error">{error}</p>}

        <div
          className={`survey-button-row ${
            showPrev ? "with-prev" : "only-next"
          }`}
        >
          {showPrev && (
            <button className="survey-prev-button" onClick={onPrev}>
              이전
            </button>
          )}

          <button
            className={isFinal ? "survey-submit-button" : "survey-next-button"}
            onClick={onNext}
          >
            {isFinal ? "제출" : "다음"}
          </button>
        </div>
      </section>
    </main>
  );
}