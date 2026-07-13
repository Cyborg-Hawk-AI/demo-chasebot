"use client";

import type { RecoveryMonth } from "@/lib/types";
import { formatCurrency } from "@/lib/mock-data";

interface RecoveryChartProps {
  data: RecoveryMonth[];
  highlightIndex?: number;
}

export default function RecoveryChart({ data, highlightIndex }: RecoveryChartProps) {
  const maxVal = Math.max(...data.map((d) => d.collected));

  return (
    <div className="space-y-4">
      <div className="flex h-48 items-end gap-2 sm:gap-3">
        {data.map((month, i) => {
          const heightPct = (month.collected / maxVal) * 100;
          const attrPct = (month.attributed / maxVal) * 100;
          const isHighlight = highlightIndex === i;

          return (
            <button
              key={month.month}
              type="button"
              className="group flex flex-1 flex-col items-center gap-1"
              title={`${month.month}: ${formatCurrency(month.attributed)} attributed`}
            >
              <div className="relative flex w-full flex-col items-center justify-end" style={{ height: "160px" }}>
                <div
                  className={`w-full rounded-t transition-all ${
                    isHighlight ? "bg-brand-600/30" : "bg-surface-600/50"
                  }`}
                  style={{ height: `${heightPct}%` }}
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isHighlight ? "bg-brand-500" : "bg-brand-600/60 group-hover:bg-brand-500/80"
                    }`}
                    style={{
                      height: heightPct > 0 ? `${(attrPct / heightPct) * 100}%` : "0",
                      minHeight: attrPct > 0 ? "4px" : "0",
                    }}
                  />
                </div>
              </div>
              <span
                className={`text-[10px] sm:text-xs ${
                  isHighlight ? "font-semibold text-brand-400" : "text-gray-500"
                }`}
              >
                {month.month.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-500" />
          Attributed to ChaseBot
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-surface-600" />
          Other collections
        </span>
      </div>
    </div>
  );
}
