-- material_code 컬럼 삭제 마이그레이션
-- 코드 배포(Vercel) 완료 후 Supabase SQL Editor에서 실행하세요.
ALTER TABLE materials DROP COLUMN IF EXISTS material_code;
