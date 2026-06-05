export function FormField({ label, error, children }) {
  return (
    <div>
      {label && (
        <label className="text-sm text-textSecondary mb-1.5 block">{label}</label>
      )}
      {children}
      {error && (
        <p className="text-xs text-danger mt-1">{error}</p>
      )}
    </div>
  );
}