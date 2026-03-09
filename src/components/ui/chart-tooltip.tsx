import type { TooltipProps } from "recharts";

interface ChartTooltipProps extends TooltipProps<number, string> {
  /** Optional formatter for value display */
  valueFormatter?: (value: number, name: string) => [string | number, string];
  /** Optional title override */
  title?: string;
}

/**
 * Ant Design–style tooltip card for Recharts.
 * Renders a clean white card with subtle shadow and arrow.
 */
export function ChartTooltip({ active, payload, label, valueFormatter, title }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="relative z-50 min-w-[160px] rounded-lg border border-border bg-card px-4 py-3 shadow-lg animate-in fade-in-0 zoom-in-95">
      {/* Arrow */}
      <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 h-[10px] w-[10px] rotate-45 border-b border-r border-border bg-card" />

      {/* Title */}
      <p className="mb-2 text-xs font-semibold text-card-foreground border-b border-border/50 pb-1.5">
        {title || label}
      </p>

      {/* Items */}
      <ul className="space-y-1">
        {payload.map((entry, i) => {
          const [val, name] = valueFormatter
            ? valueFormatter(entry.value as number, entry.name as string)
            : [entry.value, entry.name];
          return (
            <li key={i} className="flex items-center justify-between gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: entry.color }}
                />
                {name}
              </span>
              <span className="font-semibold text-card-foreground">{val}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
