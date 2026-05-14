import FormCard from "../components/FormCard";
import ErrorText from "../components/ErrorText";
import PrimaryButton from "../components/PrimaryButton";

export default function ConsentPage({
  agreed,
  consentName,
  gender,
  consentBirth,
  error,
  onChangeAgreed,
  onChangeName,
  onChangeGender,
  onChangeBirth,
  onNext,
}) {
  return (
    <main className="mobile-page">
      <section className="screen consent-screen">
        <h1 className="consent-title">연구 참여 동의서</h1>

        <p className="consent-paragraph">
          본 연구에 참여해 주셔서 진심으로 감사드립니다. 본 설문에는 정답이
          없으며, 귀하의 솔직한 의견이 가장 귀중한 자료가 됩니다.
        </p>

        <ul className="consent-list">
          <li>
            자율적 참여: 신체적·심리적 위험은 없으며, 원치 않으시면 언제든
            참여를 중단할 수 있습니다. 단, 끝까지 완료하신 분에 한해 참여비가
            지급됩니다.
          </li>
          <li>
            안전 및 비밀보장: 수집된 응답은 연구진 외에 철저히 접근이 차단되며,
            순수 학술 목적의 통계로만 안전하게 사용됩니다.
          </li>
          <li>
            문의: 연구 결과나 기타 궁금한 점이 있으신 경우 언제든 연구진에게
            연락하실 수 있습니다.
          </li>
        </ul>

        <p className="consent-paragraph last-text">
          귀하의 성실한 답변과 협조에 다시 한번 감사드립니다.
        </p>

        <FormCard minHeightClass="consent-check-card">
          <label className="card-label">연구 참여 동의 여부</label>

          <label className="check-option">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => onChangeAgreed(e.target.checked)}
            />
            <span>예</span>
          </label>
        </FormCard>

        <FormCard>
          <label className="card-label" htmlFor="consentName">
            이름
          </label>
          <input
            id="consentName"
            className="line-input"
            type="text"
            placeholder="단답형 텍스트"
            value={consentName}
            onChange={(e) => onChangeName(e.target.value)}
          />
        </FormCard>

        <FormCard minHeightClass="gender-card">
          <label className="card-label">성별</label>

          <label className="radio-option">
            <input
              type="radio"
              name="gender"
              value="남"
              checked={gender === "남"}
              onChange={(e) => onChangeGender(e.target.value)}
            />
            <span>남</span>
          </label>

          <label className="radio-option">
            <input
              type="radio"
              name="gender"
              value="여"
              checked={gender === "여"}
              onChange={(e) => onChangeGender(e.target.value)}
            />
            <span>여</span>
          </label>
        </FormCard>

        <FormCard>
          <label className="card-label" htmlFor="consentBirth">
            생년월일(예: 19980812)
          </label>
          <input
            id="consentBirth"
            className="line-input"
            type="text"
            inputMode="numeric"
            maxLength={8}
            placeholder="단답형 텍스트"
            value={consentBirth}
            onChange={(e) => onChangeBirth(e.target.value)}
          />
        </FormCard>

        <ErrorText message={error} className="consent-error" />

        <PrimaryButton className="consent-next-button" onClick={onNext}>
          다음
        </PrimaryButton>
      </section>
    </main>
  );
}