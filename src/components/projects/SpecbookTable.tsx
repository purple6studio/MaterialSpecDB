"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectSpec } from "@/lib/actions";
import { AddSpecModal } from "./AddSpecModal";
import type {
  ProjectSpec,
  Material,
  MaterialCategory,
  DistributorContact,
  Distributor,
  MaterialDistributorLink,
} from "@/types";

type SpecItem = ProjectSpec & {
  material: (Material & { category: MaterialCategory | null }) | null;
  distributor: (Pick<Distributor, "id" | "company_name"> & { contacts: DistributorContact[] }) | null;
};

interface Props {
  specItems: SpecItem[];
  projectId: string;
  isDraft: boolean;
  materials: Material[];
  categories: MaterialCategory[];
  distributors: Distributor[];
  links: MaterialDistributorLink[];
}

export function SpecbookTable({
  specItems,
  projectId,
  isDraft,
  materials,
  categories,
  distributors,
  links,
}: Props) {
  const router = useRouter();
  const [deletedIds, setDeletedIds] = useState(new Set<string>());
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const items = specItems.filter((item) => !deletedIds.has(item.id));

  function handleDelete(specId: string) {
    setDeletingId(specId);
    setDeletedIds((prev) => new Set([...prev, specId]));
    startTransition(async () => {
      await deleteProjectSpec(specId, projectId);
      setDeletingId(null);
      router.refresh();
    });
  }

  return (
    <div>
      {isDraft && (
        <div className="flex justify-end mb-4">
          <AddSpecModal
            projectId={projectId}
            materials={materials}
            categories={categories}
            distributors={distributors}
            links={links}
            onAdded={() => router.refresh()}
          />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {isDraft ? "상단 버튼으로 스펙을 추가해주세요." : "등록된 자재 스펙이 없습니다."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4 w-8">#</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">MATERIAL</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">CODE</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">ITEM</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">DISTRIBUTOR</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">CONTACT NO.</th>
                <th className="text-left font-medium text-muted-foreground pb-3 pr-4">LOCATION</th>
                <th className="pb-3 w-8" />
                {isDraft && <th className="pb-3 w-8" />}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const { material, distributor } = item;
                const category = material?.category ?? null;
                const contact = item.contact_id
                  ? distributor?.contacts?.find((c) => c.id === item.contact_id) ?? null
                  : null;
                const code = category
                  ? `${category.code_prefix}${item.code_suffix ? `-${item.code_suffix}` : ""}`
                  : item.code_suffix || "-";

                return (
                  <tr key={item.id} className="border-b last:border-0 group">
                    <td className="py-3 pr-4 text-muted-foreground text-xs">{idx + 1}</td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-medium">{category?.category_eng ?? "-"}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs font-mono">{code}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs">{material?.material_item ?? "-"}</span>
                    </td>
                    <td className="py-3 pr-4">
                      {distributor ? (
                        <Link href={`/distributors/${distributor.id}`} className="text-xs hover:underline">
                          {distributor.company_name}
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      {contact ? (
                        <div>
                          <div className="text-xs font-medium">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.phone}</div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-xs text-muted-foreground">{item.location || "-"}</span>
                    </td>
                    <td className="py-3">
                      {material && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <Link href={`/materials/${material.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      )}
                    </td>
                    {isDraft && (
                      <td className="py-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
