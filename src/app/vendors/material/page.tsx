import { getVendors } from "@/lib/data";
import { VendorsFilter } from "@/components/vendors/VendorsFilter";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const metadata = { title: "마감재 업체 | 마감재 DB" };

export default function MaterialVendorsPage() {
  const vendors = getVendors().filter((v) => v.vendor_type === "material");
  const specialties = [...new Set(vendors.map((v) => v.specialty))].sort();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">마감재 업체</h1>
          <p className="text-muted-foreground mt-1">마감재 공급 및 시공 협력업체 관리</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          업체 등록
        </Button>
      </div>
      <VendorsFilter vendors={vendors} specialties={specialties} />
    </div>
  );
}
