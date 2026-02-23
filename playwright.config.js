// Playwright 기본 설정 (간단한 E2E)
const config = {
  testDir: 'e2e',
  timeout: 30000,
  use: { headless: true }
}
module.exports = config
