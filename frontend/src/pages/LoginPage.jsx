import FormCard from "../components/FormCard";
import ErrorText from "../components/ErrorText";
import PrimaryButton from "../components/PrimaryButton";

export default function LoginPage({
  loginName,
  loginBirth,
  error,
  onChangeName,
  onChangeBirth,
  onNext,
}) {
  return (
    <main className="mobile-page">
      <section className="screen login-screen">
        <div className="login-form-wrap">
          <FormCard>
            <label className="card-label" htmlFor="loginName">
              이름
            </label>
            <input
              id="loginName"
              className="line-input login-line-input"
              type="text"
              placeholder="단답형 텍스트"
              value={loginName}
              onChange={(e) => onChangeName(e.target.value)}
            />
          </FormCard>

          <FormCard>
            <label className="card-label" htmlFor="loginBirth">
              생년월일(예: 19980812)
            </label>
            <input
              id="loginBirth"
              className="line-input login-line-input"
              type="text"
              inputMode="numeric"
              maxLength={8}
              placeholder="단답형 텍스트"
              value={loginBirth}
              onChange={(e) => onChangeBirth(e.target.value)}
            />
          </FormCard>

          <ErrorText message={error} />
        </div>

        <div className="login-button-wrap">
          <PrimaryButton className="login-next-button" onClick={onNext}>
            다음
          </PrimaryButton>
        </div>
      </section>
    </main>
  );
}