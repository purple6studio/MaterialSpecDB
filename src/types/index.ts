export interface MaterialCategory {
  id: string;
  category_eng: string;
  category_kor: string;
  code_prefix: string;
}

export interface Material {
  id: string;
  category_id: string;
  material_code: string;
  material_item: string;
  material_finish: string;
  material_size: string;
  material_image: string | null;
}

export interface VendorContact {
  id: string;
  vendor_id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export type VendorType = "material" | "other";

export interface Vendor {
  id: string;
  vendor_type: VendorType;
  company_name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  contacts: VendorContact[];
}

export interface MaterialVendorLink {
  material_id: string;
  vendor_id: string;
}

export interface Project {
  id: string;
  project_name: string;
  project_client: string;
  project_year: number;
}

export interface ProjectSpec {
  id: string;
  project_id: string;
  material_id: string;
  vendor_id: string;
  memo: string;
}

export interface DummyData {
  material_categories: MaterialCategory[];
  materials: Material[];
  vendors: Vendor[];
  material_vendor_links: MaterialVendorLink[];
  projects: Project[];
  project_specs: ProjectSpec[];
}
