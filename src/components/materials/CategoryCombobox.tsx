"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import type { MaterialCategory } from "@/types";

interface Props {
  categories: MaterialCategory[];
  value: string;
  onChange: (value: string) => void;
}

export function CategoryCombobox({ categories, value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const selected = categories.find((c) => c.id === value);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selected
              ? `${selected.category_kor} (${selected.category_eng})`
              : "카테고리 선택"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" style={{ width: "var(--radix-popover-trigger-width)" }}>
          <Command>
            <CommandInput placeholder="카테고리 검색..." />
            <CommandList>
              <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
              <CommandGroup>
                {categories.map((c) => (
                  <CommandItem
                    key={c.id}
                    value={`${c.category_kor} ${c.category_eng} ${c.code_prefix}`}
                    onSelect={() => {
                      onChange(c.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === c.id ? "opacity-100" : "opacity-0")}
                    />
                    {c.category_kor}
                    <span className="ml-1.5 text-muted-foreground text-xs">({c.category_eng})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <input type="hidden" name="category_id" value={value} />
    </>
  );
}
