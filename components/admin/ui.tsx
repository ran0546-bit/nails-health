export function PageHeader({ title, desc, children }: { title: string; desc?: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-2xl font-semibold">{title}</h1>
        {desc && <p className="mt-1.5 text-sm text-muted">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function Notice({ show, children, tone = "success" }: { show: boolean; children: React.ReactNode; tone?: "success" | "info" }) {
  if (!show) return null;
  const cls =
    tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-line bg-blush text-ink";
  return <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${cls}`}>{children}</div>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  textarea,
  rows = 3,
  type = "text",
  hint,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  type?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="field-label">
        {label}
        {required && <span className="text-brand"> *</span>}
      </span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} placeholder={placeholder} rows={rows} className="field-input" required={required} />
      ) : (
        <input name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="field-input" required={required} />
      )}
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}
