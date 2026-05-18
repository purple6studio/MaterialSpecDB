-- Migration: vendor → distributor
-- 기존에 vendor 이름으로 생성된 테이블/컬럼을 distributor로 변경합니다.
-- Supabase SQL Editor에서 한 번에 실행하세요.

-- 1. 테이블 이름 변경
ALTER TABLE vendors               RENAME TO distributors;
ALTER TABLE vendor_contacts       RENAME TO distributor_contacts;
ALTER TABLE material_vendor_links RENAME TO material_distributor_links;

-- 2. 컬럼 이름 변경
ALTER TABLE distributors              RENAME COLUMN vendor_type TO distributor_type;
ALTER TABLE distributor_contacts      RENAME COLUMN vendor_id   TO distributor_id;
ALTER TABLE material_distributor_links RENAME COLUMN vendor_id  TO distributor_id;
ALTER TABLE project_specs             RENAME COLUMN vendor_id   TO distributor_id;
