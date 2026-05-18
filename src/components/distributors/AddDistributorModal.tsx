"use client";

import { useTransition, useState } from "react";
import { createDistributor } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Distributor, DistributorType } from "@/types";

interface Props {
  onSuccess?: (distributor: Distributor) => void;
  defaultType?: DistributorType;
}

export function AddDistributorModal({ onSuccess, defaultType }: Props) {
  const [open, setOpen] = useState(false);
  const [distributorType, setDistributorType] = useState<string>(defaultType ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    const id = crypto.randomUUID();
    formData.set("id", id);
    startTransition(async () => {
      const result = await createDistributor(null, formData);
      if (result?.success) {
        onSuccess?.({
          id,
          distributor_type: (formData.get("distributor_type") as DistributorType) || "material",
          company_name: (formData.get("company_name") as string) || "",
          address: (formData.get("address") as string) || "",
          note: (formData.get("note") as string) || "",
          contacts: [],
        });
        setOpen(false);
        setDistributorType("");
      } else {
        setError(result?.error ?? "오류가 발생했습니다.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          업체 등록
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>업체 등록</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4 px-6 pb-6">
          {defaultType ? (
            <input type="hidden" name="distributor_type" value={defaultType} />
          ) : (
            <div className="space-y-1.5">
              <label className="text-sm font-medium">업체 구분 *</label>
              <Select value={distributorType} onValueChange={setDistributorType} required>
                <SelectTrigger>
                  <SelectValue placeholder="구분 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="material">마감재 업체</SelectItem>
                  <SelectItem value="other">기타 업체</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" name="distributor_type" value={distributorType} />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium">업체명 *</label>
            <Input name="company_name" placeholder="업체명 입력" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">주소</label>
            <Input name="address" placeholder="주소 입력" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">메모</label>
            <textarea
              name="note"
              placeholder="업체 특이사항, 시공 분야 등"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none h-20"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={pending || (!defaultType && !distributorType)}>
              {pending ? "등록 중..." : "등록"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
