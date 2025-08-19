import { test, expect } from '@playwright/test'
import { TestHelpers } from './utils/test-helpers'

test.describe('Component Tests', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await page.goto('/')
    await helpers.waitForAppLoad()
  })

  test('should display horse list with horse information', async ({ page }) => {
    const horses = page.locator('.horse-list .horse')
    const horseCount = await horses.count()
    
    expect(horseCount).toBeGreaterThan(0)
    
    for (let i = 0; i < Math.min(horseCount, 3); i++) {
      const horse = horses.nth(i)
      await expect(horse).toBeVisible()
    }
  })

  test('should display round list with round information', async ({ page }) => {
    const rounds = page.locator('.round-list .round')
    const roundCount = await rounds.count()
    
    expect(roundCount).toBeGreaterThan(0)
    
    for (let i = 0; i < Math.min(roundCount, 3); i++) {
      const round = rounds.nth(i)
      await expect(round).toBeVisible()
    }
  })

  test('should display arena with race lines', async ({ page }) => {
    const arena = page.locator('.arena')
    await expect(arena).toBeVisible()
    
    const lines = page.locator('.arena .lines .line')
    const lineCount = await lines.count()
    
    expect(lineCount).toBeGreaterThan(0)
  })

  test('should show action buttons in arena wrapper', async ({ page }) => {
    const actions = page.locator('.arena-wrapper .actions')
    await expect(actions).toBeVisible()
    
    const startButton = actions.locator('button:has-text("Start Round")')
    const resetButton = actions.locator('button:has-text("Reset")')
    
    await expect(startButton).toBeVisible()
    await expect(resetButton).toBeVisible()
  })

  test('should show speed controls in arena wrapper', async ({ page }) => {
    const speedControls = page.locator('.arena-wrapper .speed-controls')
    await expect(speedControls).toBeVisible()
    
    const mediumButton = speedControls.locator('button:has-text("Medium")')
    const fastButton = speedControls.locator('button:has-text("Fast")')
    const veryFastButton = speedControls.locator('button:has-text("Very Fast")')
    
    await expect(mediumButton).toBeVisible()
    await expect(fastButton).toBeVisible()
    await expect(veryFastButton).toBeVisible()
  })

  test('should have proper layout structure', async ({ page }) => {
    const app = page.locator('.app')
    const horseList = page.locator('.horse-list')
    const arenaWrapper = page.locator('.arena-wrapper')
    const roundList = page.locator('.round-list')
    
    await expect(app).toBeVisible()
    await expect(horseList).toBeVisible()
    await expect(arenaWrapper).toBeVisible()
    await expect(roundList).toBeVisible()
    
    const appLayout = await app.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return {
        display: style.display,
        justifyContent: style.justifyContent
      }
    })
    
    expect(appLayout.display).toBe('flex')
    expect(appLayout.justifyContent).toBe('center')
  })

  test('should display info box when available', async ({ page }) => {
    const infoBoxes = page.locator('.info-box')
    const infoBoxCount = await infoBoxes.count()
    
    if (infoBoxCount > 0) {
      for (let i = 0; i < infoBoxCount; i++) {
        const infoBox = infoBoxes.nth(i)
        await expect(infoBox).toBeVisible()
      }
    }
  })
})
