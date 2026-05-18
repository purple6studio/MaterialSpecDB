import { getDistributors } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";

export const metadata = { title: "마감재 업체 | 마감재 DB" };

export default async function MaterialDistributorsPage() {
  const allDistributors = await getDistributors();
  const distributors = allDistributors.filter((v) => v.distributor_type === "material");

  return (
    <div className="p-8">
      <DistributorsFilter distributors={distributors} specialties={[]} />
    </div>
  );
}
