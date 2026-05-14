export default function ErrorText({ message = "", className = "" }) {
  return <p className={`error-text ${className}`.trim()}>{message}</p>;
}