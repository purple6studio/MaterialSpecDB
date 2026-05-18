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

export interface DistributorContact {
  id: string;
  distributor_id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
}

export type DistributorType = "material" | "other";

export interface Distributor {
  id: string;
  distributor_type: DistributorType;
  company_name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  note: string;
  contacts: DistributorContact[];
}

export interface MaterialDistributorLink {
  material_id: string;
  distributor_id: string;
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
  distributor_id: string;
  memo: string;
}
