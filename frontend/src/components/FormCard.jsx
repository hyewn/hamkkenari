export default function FormCard({
  children,
  className = "",
  minHeightClass = "",
}) {
  return (
    <div className={`form-card ${minHeightClass} ${className}`.trim()}>
      {children}
    </div>
  );
}