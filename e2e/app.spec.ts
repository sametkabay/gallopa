import { test, expect } from '@playwright/test'
import { TestHelpers } from './utils/test-helpers'

test.describe('Gallopa App', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await page.goto('/')
    await helpers.waitForAppLoad()
  })

  test('should load application successfully', async ({ page }) => {
    await expect(page.locator('.app')).toBeVisible()
    await expect(page.locator('.horse-list')).toBeVisible()
    await expect(page.locator('.arena-wrapper')).toBeVisible()
    await expect(page.locator('.round-list')).toBeVisible()
  })

  test('should display horses in horse list', async ({ page }) => {
    const horseCount = await helpers.getHorseCount()
    expect(horseCount).toBeGreaterThan(0)
  })

  test('should display rounds in round list', async ({ page }) => {
    const roundCount = await helpers.getRoundCount()
    expect(roundCount).toBeGreaterThan(0)
  })

  test('should show start button initially', async ({ page }) => {
    await expect(page.locator('button:has-text("Start Round 1")')).toBeVisible()
    await expect(page.locator('button:has-text("Reset")')).toBeVisible()
  })

  test('should have speed control buttons', async ({ page }) => {
    await expect(page.locator('button:has-text("Medium")')).toBeVisible()
    await expect(page.locator('button:has-text("Fast")')).toBeVisible()
    await expect(page.locator('button:has-text("Very Fast")')).toBeVisible()
  })

  test('should display arena with grass background', async ({ page }) => {
    const arena = page.locator('.arena')
    await expect(arena).toBeVisible()
    
    const backgroundImage = await arena.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.backgroundImage
    })
    
    expect(backgroundImage).toContain('grass.jpg')
  })
})
