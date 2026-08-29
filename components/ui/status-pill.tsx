import { cn } from "@/lib/utils";

type Tone = "neutral" | "accent";

const TONES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-600",
  accent: "bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)]",
};

export function StatusPill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
