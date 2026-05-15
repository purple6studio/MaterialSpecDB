import { notFound } from "next/navigation";
import Link from "next/link";
import { getMaterialById, getMaterialCategoryById, getVendorsForMaterial, getData } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MaterialDetailTabs } from "@/components/materials/MaterialDetailTabs";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MaterialDetailPage({ params }: Props) {
  const { id } = await params;
  const material = getMaterialById(id);
  if (!material) notFound();

  const category = getMaterialCategoryById(material.category_id);
  const vendors = getVendorsForMaterial(id);
  const data = getData();

  const relatedProjects = data.project_specs
    .filter((s) => s.material_id === id)
    .map((spec) => ({ spec, project: data.projects.find((p) => p.id === spec.project_id) }))
    .filter((r): r is { spec: typeof r.spec; project: NonNullable<typeof r.project> } => r.project !== undefined);

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2 text-muted-foreground" asChild>
        <Link href="/materials">
          <ArrowLeft className="h-4 w-4" />
          마감재 목록으로
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {category && (
              <>
                <span className="inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                  {category.category_kor}
                </span>
                <span className="text-xs text-muted-foreground">{category.category_eng}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{material.material_item}</h1>
          <p className="text-muted-foreground font-mono text-sm mt-1">{material.material_code}</p>
        </div>
      </div>

      {/* Tabs */}
      <MaterialDetailTabs
        material={material}
        category={category}
        vendors={vendors}
        relatedProjects={relatedProjects}
      />
    </div>
  );
}
