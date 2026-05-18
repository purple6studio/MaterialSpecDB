import { getDistributors } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";

export const metadata = { title: "마감재 업체 | 마감재 DB" };

export default async function MaterialDistributorsPage() {
  const distributors = await getDistributors();

  return (
    <div className="p-8">
      <DistributorsFilter distributors={distributors} specialties={[]} defaultType="material" />
    </div>
  );
}
