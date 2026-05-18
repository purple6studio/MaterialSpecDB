-- MaterialSpecDB Schema
-- Supabase SQL Editor에서 순서대로 실행하세요.

-- 1. 카테고리
CREATE TABLE IF NOT EXISTS material_categories (
  id          TEXT PRIMARY KEY,
  category_eng TEXT NOT NULL,
  category_kor TEXT NOT NULL,
  code_prefix  TEXT NOT NULL
);

-- 2. 마감재
CREATE TABLE IF NOT EXISTS materials (
  id              TEXT PRIMARY KEY,
  category_id     TEXT REFERENCES material_categories(id) ON DELETE SET NULL,
  material_code   TEXT NOT NULL,
  material_item   TEXT NOT NULL,
  material_finish TEXT,
  material_size   TEXT,
  material_image  TEXT
);

-- 3. 업체
CREATE TABLE IF NOT EXISTS distributors (
  id                TEXT PRIMARY KEY,
  distributor_type  TEXT NOT NULL CHECK (distributor_type IN ('material', 'other')),
  company_name      TEXT NOT NULL,
  specialty         TEXT,
  address           TEXT,
  phone             TEXT,
  email             TEXT,
  note              TEXT
);

-- 4. 업체 담당자
CREATE TABLE IF NOT EXISTS distributor_contacts (
  id              TEXT PRIMARY KEY,
  distributor_id  TEXT NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  role            TEXT,
  phone           TEXT,
  email           TEXT
);

-- 5. 마감재 ↔ 업체 M:N 링크
CREATE TABLE IF NOT EXISTS material_distributor_links (
  material_id     TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  distributor_id  TEXT NOT NULL REFERENCES distributors(id) ON DELETE CASCADE,
  PRIMARY KEY (material_id, distributor_id)
);

-- 6. 프로젝트
CREATE TABLE IF NOT EXISTS projects (
  id             TEXT PRIMARY KEY,
  project_name   TEXT NOT NULL,
  project_client TEXT,
  project_year   INTEGER
);

-- 7. 스펙북 항목
CREATE TABLE IF NOT EXISTS project_specs (
  id              TEXT PRIMARY KEY,
  project_id      TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  material_id     TEXT REFERENCES materials(id) ON DELETE SET NULL,
  distributor_id  TEXT REFERENCES distributors(id) ON DELETE SET NULL,
  memo            TEXT
);

-- ──────────────────────────────────────────
-- Row Level Security (선택사항)
-- 현재는 anon key로 전체 읽기 허용
-- ──────────────────────────────────────────
ALTER TABLE material_categories      ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributors              ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributor_contacts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE material_distributor_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_specs             ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon read" ON material_categories       FOR SELECT USING (true);
CREATE POLICY "anon read" ON materials                  FOR SELECT USING (true);
CREATE POLICY "anon read" ON distributors               FOR SELECT USING (true);
CREATE POLICY "anon read" ON distributor_contacts       FOR SELECT USING (true);
CREATE POLICY "anon read" ON material_distributor_links FOR SELECT USING (true);
CREATE POLICY "anon read" ON projects                   FOR SELECT USING (true);
CREATE POLICY "anon read" ON project_specs              FOR SELECT USING (true);
