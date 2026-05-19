"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  className?: string;
}

export function PhoneInput({ value, onChange, compact = false, className }: Props) {
  const parts = value ? value.split("-") : ["", "", ""];
  const p1 = parts[0] ?? "";
  const p2 = parts[1] ?? "";
  const p3 = parts[2] ?? "";

  const ref2 = useRef<HTMLInputElement>(null);
  const ref3 = useRef<HTMLInputElement>(null);

  function combine(a: string, b: string, c: string) {
    if (!a && !b && !c) return "";
    return [a, b, c].join("-");
  }

  function handleChange(part: 1 | 2 | 3, raw: string) {
    const digits = raw.replace(/\D/g, "");
    if (part === 1) {
      onChange(combine(digits, p2, p3));
      if (digits.length >= 4) ref2.current?.focus();
    } else if (part === 2) {
      onChange(combine(p1, digits, p3));
      if (digits.length >= 4) ref3.current?.focus();
    } else {
      onChange(combine(p1, p2, digits));
    }
  }

  const inp = compact
    ? "w-12 h-7 rounded-md border border-input bg-transparent px-1.5 py-1 text-xs text-center tabular-nums shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
    : "w-16 h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm text-center tabular-nums shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

  const sep = compact ? "text-muted-foreground text-xs" : "text-muted-foreground";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <input
        className={inp}
        value={p1}
        onChange={(e) => handleChange(1, e.target.value)}
        maxLength={4}
        placeholder="010"
        inputMode="numeric"
      />
      <span className={sep}>-</span>
      <input
        ref={ref2}
        className={inp}
        value={p2}
        onChange={(e) => handleChange(2, e.target.value)}
        maxLength={4}
        placeholder="0000"
        inputMode="numeric"
      />
      <span className={sep}>-</span>
      <input
        ref={ref3}
        className={inp}
        value={p3}
        onChange={(e) => handleChange(3, e.target.value)}
        maxLength={4}
        placeholder="0000"
        inputMode="numeric"
      />
    </div>
  );
}
