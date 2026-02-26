import React from 'react'
import {motion as Motion} from 'framer-motion'
function Systeminfo({ metricCards, metrics }) {
    const toneStyles = {
      strong: "text-emerald-500 bg-emerald-300/15",
      normal: "text-emerald-500 bg-emerald-300/10",
      warning: "text-amber-500 bg-amber-300/15",
    };
  return (
    <div className="xl:col-span-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {metricCards.map((item, index) => {
        const Icon = item.icon;
        const value = metrics[item.key];

        return (
          <Motion.article
            key={item.key}
            className="rounded-2xl  p-4 border border-gray-200 "
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs ">{item.label}</span>
                <strong className="mt-1 block text-2xl font-semibold">
                  {value}
                  {item.unit}
                </strong>
              </div>
              <span
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles[item.tone]}`}
              >
                <Icon size={18} />
              </span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-gray-300"
              role="img"
              aria-label={`${item.label} ${value}${item.unit}`}
            >
              <span
                className="block h-full rounded-full bg-gray-600 transition-all duration-500"
                style={{ width: `${Math.min(value, 100)}%` }}
              />
            </div>
          </Motion.article>
        );
      })}
    </div>
  );
}

export default Systeminfo