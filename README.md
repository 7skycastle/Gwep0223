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

자동 배포 (권장)

- 이 리포지토리는 `main` 브랜치로 푸시될 때 GitHub Actions가 빌드하고 Vercel로 배포하도록 설정되어 있습니다.
- 필요 시 Vercel UI에서 GitHub 연동으로 직접 연결해도 됩니다.

필요한 GitHub Secrets (Repository → Settings → Secrets and variables → Actions):

- `VERCEL_TOKEN` — Vercel Personal Token
- `VERCEL_ORG_ID` — Vercel 조직 ID
- `VERCEL_PROJECT_ID` — Vercel 프로젝트 ID
- 또한 기존에 필요했던 Vercel/Supabase/SMTP/Stripe 시크릿을 GitHub에도 등록해둬야 합니다(워크플로에서 직접 사용하지 않을 수도 있지만 배포·빌드 환경에서 필요).

브랜치 보호 권장 설정

1. GitHub 리포지토리 → Settings → Branches → Add rule
2. `Branch name pattern`에 `main` 입력
3. 체크: Require pull request reviews before merging (1 이상), Require status checks to pass before merging (CI 빌드), Include administrators (선택)

이 리포지토리에는 CI 구성 파일이 추가되어 있습니다:

- `.github/workflows/ci.yml` — 푸시/PR 시 빌드 및 테스트 실행
- `.github/workflows/deploy-vercel.yml` — `main` 푸시 시 Vercel로 배포 (requires Vercel secrets)

무료 배포·테스트 사용 가이드

- Vercel: 개인 프로젝트는 Vercel Free tier로 배포 가능합니다. Vercel에서 GitHub 리포를 Import 하거나 위 워크플로를 사용하면 `main` 브랜치 푸시 시 자동 배포됩니다.
- 이메일(개발용): 실제 SMTP 정보가 없을 경우 Mailtrap(https://mailtrap.io) 같은 무료 개발용 SMTP를 사용하세요. `.env.example`의 SMTP_* 값을 Mailtrap 정보로 채워 테스트하면 됩니다.
- Stripe: 개발/테스트는 Stripe의 Test Mode를 사용하세요(테스트 키 `sk_test_*`). 결제 관련 테스트는 Stripe CLI를 이용하면 로컬 웹후크 테스트가 쉽습니다.
- CI/E2E: GitHub Actions의 무료 할당량 내에서 Playwright를 사용한 E2E 테스트가 가능합니다(워크플로에 Playwright 설치 및 테스트 단계 포함).

요약: 비용 없이도 Vercel Free + Mailtrap + Stripe Test Mode + GitHub Actions로 배포·테스트 환경을 갖출 수 있습니다.

