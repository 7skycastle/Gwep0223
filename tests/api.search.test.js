import fetch from 'node-fetch'

test('search API responds', async () => {
  const res = await fetch('http://localhost:3000/api/search')
  expect(res.status).toBeGreaterThanOrEqual(200)
})
