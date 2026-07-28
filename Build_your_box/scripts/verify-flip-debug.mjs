import { chromium } from 'playwright'

const browser = await chromium.launch({ args: ['--use-gl=swiftshader'] })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const logs = []
page.on('console', (msg) => {
  if (msg.text().includes('FLIP_DEBUG')) logs.push({ t: Date.now(), text: msg.text() })
})

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)

const sidebar = page.locator('div.overflow-y-auto')
await sidebar.evaluate((el) => el.scrollTo(0, 380))
await page.waitForTimeout(200)

const chip = page.locator('button:has-text("Auto lock")')
const t0 = Date.now()
await chip.click()
await page.waitForTimeout(3500)

console.log('total frames logged:', logs.length)
console.log('first 5:', logs.slice(0, 5).map((l) => `${l.t - t0}ms ${l.text}`).join('\n'))
console.log('last 15:', logs.slice(-15).map((l) => `${l.t - t0}ms ${l.text}`).join('\n'))

await browser.close()
