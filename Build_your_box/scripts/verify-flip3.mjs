import { chromium } from 'playwright'

const base = '/private/tmp/claude-501/-Users-emilglegula-Desktop-Dev-claude-Build-your-box/3a1fc90c-7acb-4136-9a9d-e0f188cfe9b8/scratchpad'

const browser = await chromium.launch({ args: ['--use-gl=swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const sidebar = page.locator('div.overflow-y-auto')
await sidebar.evaluate((el) => el.scrollTo(0, 380))
await page.waitForTimeout(200)

// Keep the page "active" (no rAF throttling) via a tiny periodic no-op mouse move.
let keepAlive = true
const pump = (async () => {
  let x = 700
  while (keepAlive) {
    x = x === 700 ? 701 : 700
    await page.mouse.move(x, 400)
    await page.waitForTimeout(50)
  }
})()

const chip = page.locator('button:has-text("Auto lock")')
const t0 = Date.now()
await chip.click()

const marks = [500, 1000, 1500, 2000, 2500, 3000, 3300, 3600]
for (const m of marks) {
  const elapsed = Date.now() - t0
  const wait = Math.max(0, m - elapsed)
  if (wait > 0) await page.waitForTimeout(wait)
  await page.screenshot({ path: `${base}/flip3-${String(m).padStart(4, '0')}ms.png` })
}

keepAlive = false
await pump
await browser.close()
