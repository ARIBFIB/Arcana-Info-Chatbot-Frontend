"use client";

type SuggestionChipProps = {
  label: string;
  onClick?: () => void;
  className?: string;
};

export function SuggestionChip({ label, onClick, className }: SuggestionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[50px] shrink-0 cursor-pointer rounded-full border border-white/20 bg-transparent px-5 text-[13px] font-normal whitespace-nowrap text-white/55 transition-[border-color,color] duration-200 hover:border-white/35 hover:text-white/80${className ? ` ${className}` : ""}`}
    >
      {label}
    </button>
  );
}
