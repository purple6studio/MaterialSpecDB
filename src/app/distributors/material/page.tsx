import { getDistributors, getDistributorTypes } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";

export const metadata = { title: "마감재 업체 | 마감재 DB" };

export default async function MaterialDistributorsPage() {
  const [allDistributors, allTypes] = await Promise.all([
    getDistributors(),
    getDistributorTypes(),
  ]);
  const visibleTypes = allTypes.filter((t) => t.is_material);
  const defaultType = visibleTypes[0]?.id ?? "material";

  return (
    <div className="p-8">
      <DistributorsFilter
        distributors={allDistributors}
        distributorTypes={visibleTypes}
        defaultType={defaultType}
        lockModal={true}
      />
    </div>
  );
}
