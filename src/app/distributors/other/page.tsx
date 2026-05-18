import { getDistributors } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";

export const metadata = { title: "기타 업체 | 마감재 DB" };

export default async function OtherDistributorsPage() {
  const allDistributors = await getDistributors();
  const distributors = allDistributors.filter((v) => v.distributor_type === "other");

  return (
    <div className="p-8">
      <DistributorsFilter distributors={distributors} specialties={[]} />
    </div>
  );
}
