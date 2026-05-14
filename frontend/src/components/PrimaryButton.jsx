export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}) {
  return (
    <button
      type={type}
      className={`primary-next-button ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}