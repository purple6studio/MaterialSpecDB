import { getMaterialCategories } from "@/lib/data";
import { CategoriesManager } from "@/components/materials/CategoriesManager";

export const metadata = { title: "카테고리 관리 | 마감재 DB" };

export default async function MaterialCategoriesPage() {
  const categories = await getMaterialCategories();
  return <CategoriesManager initialCategories={categories} />;
}
