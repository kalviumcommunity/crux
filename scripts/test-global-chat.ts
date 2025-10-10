// Minimal runtime test for /api/chat/global
// Run with: pnpm tsx scripts/test-global-chat.ts

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const TOKEN = process.env.TEST_JWT || ''

async function main() {
  if (!TOKEN) {
    console.warn('TEST_JWT missing – set a valid JWT to run this test against a dev server.')
  }

  const body = {
    userQuery: 'What is the latest on quantum computing breakthroughs?',
    enableWebSearch: true,
    maxWebResults: 3,
  }

  const res = await fetch(`${BASE}/api/chat/global`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify(body)
  })

  console.log('Status:', res.status)
  const json = await res.json().catch(() => ({}))
  console.log('Response keys:', Object.keys(json))
  console.log('Sample:', JSON.stringify(json, null, 2).slice(0, 1500))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
