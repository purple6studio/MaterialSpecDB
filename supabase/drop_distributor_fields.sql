-- distributors 테이블에서 specialty, phone, email 컬럼 삭제
-- 코드 배포(Vercel) 완료 후 Supabase SQL Editor에서 실행하세요.
ALTER TABLE distributors DROP COLUMN IF EXISTS specialty;
ALTER TABLE distributors DROP COLUMN IF EXISTS phone;
ALTER TABLE distributors DROP COLUMN IF EXISTS email;
