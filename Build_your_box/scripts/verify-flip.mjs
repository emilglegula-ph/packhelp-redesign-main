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
await page.screenshot({ path: `${base}/flip-0-before.png` })

// Scroll to Closure section and click "Auto lock" (currently unselected)
const sidebar = page.locator('div.overflow-y-auto')
await sidebar.evaluate((el) => el.scrollTo(0, 380))
await page.waitForTimeout(200)
await page.screenshot({ path: `${base}/flip-scroll-check.png` })

const autoLockChip = page.locator('button:has-text("Auto lock")')
await autoLockChip.click()

// Capture a few frames during the flip-out phase
await page.waitForTimeout(250)
await page.screenshot({ path: `${base}/flip-1-mid-out.png` })
await page.waitForTimeout(400)
await page.screenshot({ path: `${base}/flip-2-near-flipped.png` })

// During hold (should show bottom clearly)
await page.waitForTimeout(600)
await page.screenshot({ path: `${base}/flip-3-holding.png` })

// During return
await page.waitForTimeout(1300)
await page.screenshot({ path: `${base}/flip-4-mid-return.png` })

// Settled back
await page.waitForTimeout(900)
await page.screenshot({ path: `${base}/flip-5-settled.png` })

console.log('errors:', errors.length ? errors : 'none')
await browser.close()
