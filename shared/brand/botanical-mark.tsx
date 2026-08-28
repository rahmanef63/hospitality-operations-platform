import { cn } from "@/lib/utils";

type BotanicalMarkProps = {
  className?: string;
  title?: string;
};

export function BotanicalMark({ className, title }: BotanicalMarkProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden={labelled ? undefined : true}
      role={labelled ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 101C38 83 50 66 59 46C65 33 69 21 72 11" />
        <path d="M44 75C36 68 31 59 30 49" />
        <path d="M54 56C47 49 44 41 44 32" />
        <path d="M62 39C57 33 55 26 56 18" />
        <path d="M52 61C63 57 72 50 79 40" />
        <path d="M59 45C70 42 79 36 86 27" />
        <path d="M66 28C76 26 84 21 91 14" />
      </g>
      <g fill="currentColor">
        <ellipse cx="28" cy="45" rx="4.2" ry="8" transform="rotate(-28 28 45)" />
        <ellipse cx="38" cy="64" rx="4" ry="7.6" transform="rotate(-38 38 64)" />
        <ellipse cx="43" cy="28" rx="4" ry="7.5" transform="rotate(-12 43 28)" />
        <ellipse cx="55" cy="16" rx="3.8" ry="7" transform="rotate(10 55 16)" />
        <ellipse cx="80" cy="37" rx="7.5" ry="4" transform="rotate(-34 80 37)" />
        <ellipse cx="87" cy="24" rx="7.2" ry="3.8" transform="rotate(-32 87 24)" />
        <ellipse cx="93" cy="12" rx="6.5" ry="3.5" transform="rotate(-28 93 12)" />
        <ellipse cx="69" cy="51" rx="7.4" ry="4" transform="rotate(-28 69 51)" />
      </g>
    </svg>
  );
}
