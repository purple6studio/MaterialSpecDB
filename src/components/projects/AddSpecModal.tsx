"use client";

import { useState, useTransition } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { addProjectSpec } from "@/lib/actions";
import type { Material, MaterialCategory, Distributor, MaterialDistributorLink } from "@/types";

interface Props {
  projectId: string;
  materials: Material[];
  categories: MaterialCategory[];
  distributors: Distributor[];
  links: MaterialDistributorLink[];
  onAdded: () => void;
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-xs text-foreground">{value || "-"}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className="h-8 text-sm"
      />
    </div>
  );
}

export function AddSpecModal({
  projectId,
  materials,
  categories,
  distributors,
  links,
  onAdded,
}: Props) {
  const [open, setOpen] = useState(false);
  const [comboOpen, setComboOpen] = useState(false);
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [distributorId, setDistributorId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);
  const [codeSuffix, setCodeSuffix] = useState("");
  const [quantity, setQuantity] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [delivery, setDelivery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const selectedMaterial = materials.find((m) => m.id === materialId) ?? null;
  const selectedCategory = selectedMaterial
    ? categories.find((c) => c.id === selectedMaterial.category_id) ?? null
    : null;

  const linkedDistributorIds = links
    .filter((l) => l.material_id === materialId)
    .map((l) => l.distributor_id);
  const linkedDistributors = distributors.filter((d) => linkedDistributorIds.includes(d.id));
  const selectedDistributor = linkedDistributors.find((d) => d.id === distributorId) ?? null;

  function handleMaterialSelect(id: string) {
    setMaterialId(id);
    setDistributorId(null);
    setContactId(null);
    setComboOpen(false);
  }

  function handleDistributorChange(id: string) {
    setDistributorId(id);
    setContactId(null);
  }

  function handleSubmit() {
    if (!materialId) { setError("자재를 선택해주세요."); return; }
    if (!distributorId) { setError("업체를 선택해주세요."); return; }
    setError(null);
    startTransition(async () => {
      const result = await addProjectSpec(projectId, {
        material_id: materialId,
        distributor_id: distributorId,
        code_suffix: codeSuffix,
        contact_id: contactId,
        quantity,
        area,
        location,
        description,
        price,
        delivery,
      });
      if (result?.success) {
        resetForm();
        setOpen(false);
        onAdded();
      } else {
        setError(result?.error ?? "오류가 발생했습니다.");
      }
    });
  }

  function resetForm() {
    setMaterialId(null);
    setDistributorId(null);
    setContactId(null);
    setCodeSuffix("");
    setQuantity("");
    setArea("");
    setLocation("");
    setDescription("");
    setPrice("");
    setDelivery("");
    setError(null);
  }

  function handleOpenChange(val: boolean) {
    setOpen(val);
    if (!val) resetForm();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          추가 입력
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>스펙 추가 입력</DialogTitle>
        </DialogHeader>
        <div className="space-y-5 px-6 pb-6">

          {/* 자재 선택 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">자재 *</label>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedMaterial ? selectedMaterial.material_item : "자재를 검색하세요"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[420px] p-0">
                <Command>
                  <CommandInput placeholder="자재명 검색..." />
                  <CommandList>
                    <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                    <CommandGroup>
                      {materials.map((m) => (
                        <CommandItem
                          key={m.id}
                          value={`${m.material_item} ${m.material_finish ?? ""} ${m.material_size ?? ""}`}
                          onSelect={() => handleMaterialSelect(m.id)}
                        >
                          <Check className={cn("mr-2 h-4 w-4 shrink-0", materialId === m.id ? "opacity-100" : "opacity-0")} />
                          <div>
                            <div className="font-medium">{m.material_item}</div>
                            <div className="text-xs text-muted-foreground">
                              {[m.material_finish, m.material_size].filter(Boolean).join(" · ")}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* 자재 정보 자동 표시 */}
          {selectedMaterial && (
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <InfoRow label="MATERIAL" value={selectedCategory?.category_eng} />
              <div className="flex items-center gap-3">
                <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">CODE</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-muted-foreground">
                    {selectedCategory?.code_prefix ?? "??"}
                  </span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <Input
                    value={codeSuffix}
                    onChange={(e) => setCodeSuffix(e.target.value)}
                    placeholder="01"
                    className="h-7 w-20 text-xs font-mono"
                  />
                </div>
              </div>
              <InfoRow label="ITEM" value={selectedMaterial.material_item} />
              <InfoRow label="FINISH" value={selectedMaterial.material_finish} />
              <InfoRow label="SIZE" value={selectedMaterial.material_size} />
            </div>
          )}

          {/* 업체 선택 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">업체 *</label>
            {!materialId ? (
              <p className="text-sm text-muted-foreground py-1">자재를 먼저 선택해주세요.</p>
            ) : linkedDistributors.length === 0 ? (
              <p className="text-sm text-muted-foreground py-1">연결된 업체가 없습니다. 마감재 DB에서 업체를 연결해주세요.</p>
            ) : (
              <Select value={distributorId ?? ""} onValueChange={handleDistributorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="업체를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {linkedDistributors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.company_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* 담당자 선택 */}
          {selectedDistributor && selectedDistributor.contacts.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">담당자</label>
              <Select value={contactId ?? ""} onValueChange={(v) => setContactId(v || null)}>
                <SelectTrigger>
                  <SelectValue placeholder="담당자 선택 (선택사항)" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDistributor.contacts.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}{c.phone ? ` · ${c.phone}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 추가 정보 */}
          <div className="space-y-3 pt-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">추가 정보</p>
            <div className="grid grid-cols-2 gap-3">
              <Field label="QUANTITY" value={quantity} onChange={setQuantity} />
              <Field label="AREA" value={area} onChange={setArea} />
              <Field label="PRICE" value={price} onChange={setPrice} />
              <Field label="DELIVERY" value={delivery} onChange={setDelivery} />
            </div>
            <Field label="LOCATION" value={location} onChange={setLocation} />
            <Field label="DESCRIPTION" value={description} onChange={setDescription} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              취소
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={pending || !materialId || !distributorId}
            >
              {pending ? "추가 중..." : "추가"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
