"use client";

import { Input } from "antd";
import { Search } from "lucide-react";

import { ui } from "@/design-system/components";

type SearchBarProps = {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function SearchBar({
  placeholder = "Search",
  className,
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Input
      className={`${ui.adminSearchBar}${className ? ` ${className}` : ""}`}
      size="large"
      placeholder={placeholder}
      aria-label={placeholder}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      prefix={<Search size={18} className="shrink-0 text-white/35" aria-hidden />}
    />
  );
}
