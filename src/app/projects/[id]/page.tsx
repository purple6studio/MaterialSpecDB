import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById, getProjectSpecsWithDetails } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [project, specItems] = await Promise.all([
    getProjectById(id),
    getProjectSpecsWithDetails(id),
  ]);
  if (!project) notFound();

  return (
    <div className="p-8">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2 text-muted-foreground" asChild>
        <Link href="/projects">
          <ArrowLeft className="h-4 w-4" />
          프로젝트 목록으로
        </Link>
      </Button>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{project.project_year}</p>
          <h1 className="text-2xl font-bold tracking-tight">{project.project_name}</h1>
          <p className="text-muted-foreground text-sm mt-1">{project.project_client}</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="h-4 w-4" />
          스펙북 출력
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            스펙북 ({specItems.length}개 자재)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {specItems.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              등록된 자재 스펙이 없습니다.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left font-medium text-muted-foreground pb-3 w-8">#</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">자재</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">카테고리</th>
                  <th className="text-left font-medium text-muted-foreground pb-3">공급업체</th>
                  <th className="text-left font-medium text-muted-foreground pb-3 pl-6">메모</th>
                  <th className="pb-3 w-10" />
                </tr>
              </thead>
              <tbody>
                {specItems.map((item, idx) => {
                  const { material, distributor } = item;
                  const category = material?.category ?? null;
                  return (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 text-muted-foreground">{idx + 1}</td>
                      <td className="py-3">
                        <div className="font-medium">{material?.material_item ?? item.material_id}</div>
                      </td>
                      <td className="py-3">
                        {category ? (
                          <div>
                            <div className="text-xs font-medium">{category.category_kor}</div>
                            <div className="text-xs text-muted-foreground">{category.category_eng}</div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3">
                        {distributor ? (
                          <Link href={`/distributors/${distributor.id}`} className="hover:underline">
                            {distributor.company_name}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="py-3 pl-6 text-muted-foreground text-xs max-w-xs">
                        {item.memo}
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
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
