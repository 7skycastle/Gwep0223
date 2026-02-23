const { test, expect } = require('@playwright/test')

test('홈 페이지 로드', async ({ page }) => {
  await page.goto('http://localhost:3000')
  await expect(page.locator('h1')).toHaveText(/아이디어 마켓/)
})
