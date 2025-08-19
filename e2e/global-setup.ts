import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  await page.goto('http://localhost:5173')
  await page.waitForLoadState('networkidle')
  
  await browser.close()
}

export default globalSetup
