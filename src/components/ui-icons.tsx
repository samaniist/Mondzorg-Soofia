type IconProps = {
  className?: string;
};

const commonProps = {
  "aria-hidden": true,
  focusable: false,
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  strokeWidth: 1.5,
};

export function ArrowUpRightIcon({ className = "ui-icon" }: IconProps) {
  return (
    <svg {...commonProps} className={className} viewBox="0 0 16 16">
      <path d="M4 12 12 4M5 4h7v7" />
    </svg>
  );
}

export function ArrowLeftIcon({ className = "ui-icon" }: IconProps) {
  return (
    <svg {...commonProps} className={className} viewBox="0 0 16 16">
      <path d="m6.5 3.5-4.5 4.5 4.5 4.5M2 8h12" />
    </svg>
  );
}

export function ArrowRightIcon({ className = "ui-icon" }: IconProps) {
  return (
    <svg {...commonProps} className={className} viewBox="0 0 16 16">
      <path d="m9.5 3.5 4.5 4.5-4.5 4.5M14 8H2" />
    </svg>
  );
}

export function ChevronDownIcon({ className = "ui-icon" }: IconProps) {
  return (
    <svg {...commonProps} className={className} viewBox="0 0 16 16">
      <path d="m3.5 6 4.5 4 4.5-4" />
    </svg>
  );
}
