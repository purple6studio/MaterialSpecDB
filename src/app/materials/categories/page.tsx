import { getMaterialCategories } from "@/lib/data";
import { CategoriesManager } from "@/components/materials/CategoriesManager";

export const metadata = { title: "카테고리 관리 | 마감재 DB" };

export default function MaterialCategoriesPage() {
  const categories = getMaterialCategories();
  return <CategoriesManager initialCategories={categories} />;
}
