import { getDistributors } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "기타 업체 | 마감재 DB" };

export default async function OtherDistributorsPage() {
  const allDistributors = await getDistributors();
  const distributors = allDistributors.filter((v) => v.distributor_type === "other");
  const specialties = [...new Set(distributors.map((v) => v.specialty))].sort();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">기타 업체</h1>
          <p className="text-muted-foreground mt-1">전기·설비 등 기타 협력 업체 관리</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          업체 등록
        </Button>
      </div>
      <DistributorsFilter distributors={distributors} specialties={specialties} />
    </div>
  );
}
