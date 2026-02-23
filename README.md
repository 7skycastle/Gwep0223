# 아이디어 마켓 (Supabase + Next.js)

간단한 스캐폴딩입니다. 기능:
- 상품(이미지/짧은 영상) 업로드
- 서버에서 SHA-256 해시 생성
- PDF 저작권 증명서 생성 및 스토리지 저장
- Supabase `products` 테이블에 메타데이터 저장

설정
1. 환경변수 설정 (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. 의존성 설치

```bash
npm install
npm run dev
```

3. DB 스키마 (Supabase SQL)

See [sql/schema.sql](sql/schema.sql)

다음 단계
- 인증(회원가입/로그인) 연결
- 프론트엔드 랭킹 페이지/조회수 증가 구현
- Vercel 배포
