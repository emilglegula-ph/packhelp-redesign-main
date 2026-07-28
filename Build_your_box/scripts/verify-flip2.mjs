import { chromium } from 'playwright'

const base = '/private/tmp/claude-501/-Users-emilglegula-Desktop-Dev-claude-Build-your-box/3a1fc90c-7acb-4136-9a9d-e0f188cfe9b8/scratchpad'

const browser = await chromium.launch({ args: ['--use-gl=swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(String(err)))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const sidebar = page.locator('div.overflow-y-auto')
await sidebar.evaluate((el) => el.scrollTo(0, 380))
await page.waitForTimeout(200)

const snapLockChip = page.locator('button:has-text("Snap lock")')
const t0 = Date.now()
await snapLockChip.click()

const marks = [300, 700, 1100, 1600, 2100, 2600, 3100, 3600]
for (const m of marks) {
  const elapsed = Date.now() - t0
  const wait = Math.max(0, m - elapsed)
  if (wait > 0) await page.waitForTimeout(wait)
  await page.screenshot({ path: `${base}/flip2-${String(m).padStart(4, '0')}ms.png` })
}

console.log('errors:', errors.length ? errors : 'none')
await browser.close()
