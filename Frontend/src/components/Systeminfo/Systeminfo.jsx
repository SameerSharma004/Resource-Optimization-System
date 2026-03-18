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
    strong: "text-primary bg-primary/20 border-primary/20",
    normal: "text-primary bg-primary/10 border-primary/10",
    warning: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  const numericValue = Number(value ?? 0);
  const displayValue = isNaN(numericValue) ? 0 : Math.round(numericValue);

  return (
    <article
      className="rounded-[32px] p-6 border bg-card border-border shadow-sm group hover:border-primary/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            {label}
          </span>
          <strong className="mt-1 block text-2xl font-black text-foreground tracking-tighter">
            {displayValue}
            <span className="text-sm ml-1 opacity-40 font-bold">{unit}</span>
          </strong>
        </div>
        <span
          className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border transition-all ${
            toneStyles[tone]
          }`}
        >
          {Icon && <Icon size={20} />}
        </span>
      </div>
      
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-muted/30 p-0.5"
        role="img"
        aria-label={`${label} ${displayValue}${unit}`}
      >
        <span
          className="block h-full rounded-full bg-primary transition-all duration-500 shadow-[0_0_10px_rgba(99,103,255,0.3)]"
          style={{
            width: `${Math.min(Math.max(displayValue, 0), 100)}%`,
          }}
        />
      </div>
    </article>
  );
}

export default Systeminfo;
