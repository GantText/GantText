import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'

const root = process.cwd()
const mockPath = path.resolve(root, '../Mock.png')

function compare(img1: Buffer, img2: Buffer) {
  const a = PNG.sync.read(img1)
  const b = PNG.sync.read(img2)
  const { width, height } = a
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(a.data, b.data, diff.data, width, height, { threshold: 0.1 })
  return { mismatched, diff: PNG.sync.write(diff) }
}

// Start the dev server before running this test (npm run dev)
test('timeline matches mock', async ({ page }) => {
  await page.goto('/?w=876&h=230')
  const locator = page.locator('#timeline')
  const screenshot = await locator.screenshot({ omitBackground: false })
  if (!fs.existsSync(mockPath)) {
    throw new Error('Mock.png not found at project root')
  }
  const baseline = fs.readFileSync(mockPath)
  const { mismatched, diff } = compare(screenshot, baseline)

  const outDir = path.resolve(root, 'test-artifacts')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'actual.png'), screenshot)
  fs.writeFileSync(path.join(outDir, 'baseline.png'), baseline)
  fs.writeFileSync(path.join(outDir, 'diff.png'), diff)

  expect(mismatched, 'Visual differences found; see tests/test-artifacts').toBeLessThan(500) // adjust later
})
