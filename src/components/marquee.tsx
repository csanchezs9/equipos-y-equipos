import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items];
  return (
    <div className={cn("relative flex overflow-hidden py-6", className)}>
      <div className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 whitespace-nowrap pr-10">
        {row.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-2xl text-mute md:text-4xl"
          >
            {it}
            <span className="text-brand">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
