import React from "react";
function Systeminfo({
  label,
  value,
  unit,
  icon: Icon,
  tone = "normal",
  index = 0,
}) {
  const toneStyles = {
    strong: "text-emerald-500 bg-emerald-300/15",
    normal: "text-emerald-500 bg-emerald-300/10",
    warning: "text-amber-500 bg-amber-300/15",
  };
  console.log(label, value);
  const numericValue = Number(value ?? 0);
  const displayValue = isNaN(numericValue) ? 0 : Math.round(numericValue);
  return (
    <article
      className="rounded-2xl p-4 border bg-white dark:bg-background-dark border-gray-200 dark:border-primary/20 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
            {label}
          </span>
          <strong className="mt-1 block text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {displayValue}
            {unit}
          </strong>
        </div>
        <span
          className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${
            toneStyles[tone]
          }`}
        >
          {Icon && <Icon size={18} />}
        </span>
      </div>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-gray-300 dark:bg-slate-800"
        role="img"
        aria-label={`${label} ${displayValue}${unit}`}
      >
        <span
          className="block h-full rounded-full bg-slate-600 dark:bg-primary transition-all duration-500"
          style={{
            width: `${Math.min(Math.max(displayValue, 0), 100)}%`,
          }}
        />
      </div>
    </article>
  );
}
export default Systeminfo;
