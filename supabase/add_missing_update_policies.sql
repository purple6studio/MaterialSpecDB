-- 누락된 UPDATE RLS 정책 추가
-- Supabase SQL Editor에서 실행하세요.

CREATE POLICY "anon update" ON distributors   FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anon update" ON materials      FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anon update" ON projects       FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anon update" ON project_specs  FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anon update" ON material_distributor_links FOR UPDATE USING (true) WITH CHECK (true);
