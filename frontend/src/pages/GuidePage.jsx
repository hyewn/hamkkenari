import sampleImage from "../assets/chatbot-sample.png";

export default function GuidePage({ guideId, onNext }) {
  const isSecondGuide = guideId === "guide2";

  return (
    <main className="mobile-page">
      <section className="guide-screen">
        <h1 className="guide-title">지금부터 챗봇 사용을 시작합니다.</h1>

        <p className="guide-paragraph">
          다음 세가지 단계에 따라 과제를 수행해 주세요.
        </p>

        <div className="guide-step-block">
          <p className="guide-step-title">1. 질문 확인:</p>
          <p className="guide-step-desc">주어진 질문이 무엇인지 확인합니다.</p>
        </div>

        <div className="guide-step-block">
          <p className="guide-step-title">2. 정보 탐색:</p>
          <p className="guide-step-desc">
            챗봇과 대화하며 질문에 필요한 정보를 찾습니다.
          </p>
        </div>

        <div className="guide-step-block">
          <p className="guide-step-title">3. 답변 작성:</p>
          <p className="guide-step-desc">
            찾은 정보를 바탕으로 최종 답변을 작성합니다.
          </p>
        </div>

        {!isSecondGuide && (
          <>
            <div className="guide-sample-image-wrap">
              <img
                src={sampleImage}
                alt="챗봇 사용 예시"
                className="guide-sample-image"
              />
            </div>

            <p className="guide-bottom-text">
              챗봇과 대화 후에 필요한 정보를 모두 얻었다면 답안 입력하기를
              클릭합니다.
            </p>
          </>
        )}

        <div className={`guide-button-wrap ${isSecondGuide ? "guide-button-wrap-second" : ""}`}>
          <button className="guide-next-button" onClick={onNext}>
            다음
          </button>
        </div>
      </section>
    </main>
  );
}