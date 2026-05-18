-- 마감재 이미지 Storage 설정
-- Supabase 대시보드 → Storage에서 'material-images' 버킷을 Public으로 생성한 후 실행하세요.

CREATE POLICY "anon upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'material-images');
