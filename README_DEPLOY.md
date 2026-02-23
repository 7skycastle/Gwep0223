배포 및 테스트 가이드

1) Vercel 배포
- `vercel.json`에 환경변수 이름을 매핑해 두었습니다. Vercel 대시보드에서 Secret(변수)을 추가하세요.
- 필수 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `EMAIL_FROM`.

2) 로컬 실행
```bash
npm install
cp .env.example .env.local
# .env.local에 키값 채우기
npm run dev
```

3) 테스트
- 단위/통합: `npm test` (설정된 Jest 테스트가 없으므로 필요시 추가)
- E2E: `npm run e2e` (Playwright 테스트 추가 필요)

4) Stripe
- Vercel에 `STRIPE_SECRET_KEY`와 `STRIPE_WEBHOOK_SECRET`를 각각 추가하세요.
