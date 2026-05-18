import { getDistributors } from "@/lib/data";
import { DistributorsFilter } from "@/components/distributors/DistributorsFilter";

export const metadata = { title: "기타 업체 | 마감재 DB" };

export default async function OtherDistributorsPage() {
  const distributors = await getDistributors();

  return (
    <div className="p-8">
      <DistributorsFilter distributors={distributors} specialties={[]} defaultType="other" />
    </div>
  );
}
