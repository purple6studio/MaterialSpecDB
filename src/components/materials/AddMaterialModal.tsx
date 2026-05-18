"use client";

import { useTransition, useState, useRef } from "react";
import { createMaterial } from "@/lib/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryCombobox } from "@/components/materials/CategoryCombobox";
import { Plus } from "lucide-react";
import type { MaterialCategory } from "@/types";

export function AddMaterialModal({ categories }: { categories: MaterialCategory[] }) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createMaterial(null, formData);
      if (result?.success) {
        setOpen(false);
        setCategoryId("");
        setPreviewUrl(null);
        formRef.current?.reset();
      } else {
        setError(result?.error ?? "오류가 발생했습니다.");
      }
    });
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setCategoryId("");
      setPreviewUrl(null);
      setError(null);
      formRef.current?.reset();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          자재 등록
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>마감재 등록</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4 px-6 pb-6">
          {/* 카테고리 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">카테고리 *</label>
            <CategoryCombobox
              categories={categories}
              value={categoryId}
              onChange={setCategoryId}
            />
          </div>

          {/* 자재명 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">자재명 *</label>
            <Input name="material_item" placeholder="자재명 입력" required />
          </div>

          {/* 마감 처리 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">마감 처리</label>
            <Input name="material_finish" placeholder="예: 무광" />
          </div>

          {/* 크기 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">크기</label>
            <Input name="material_size" placeholder="예: 600x600mm" />
          </div>

          {/* 이미지 */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">이미지</label>
            {previewUrl && (
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted border">
                <img src={previewUrl} alt="미리보기" className="w-full h-full object-cover" />
              </div>
            )}
            <input
              type="file"
              name="material_image"
              accept="image/*"
              className="block w-full text-sm text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/80 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={pending || !categoryId}>
              {pending ? "등록 중..." : "등록"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
