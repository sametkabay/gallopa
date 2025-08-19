import { test, expect } from '@playwright/test'
import { TestHelpers } from './utils/test-helpers'

test.describe('Race Functionality', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
    await page.goto('/')
    await helpers.waitForAppLoad()
  })

  test('should start race when start button is clicked', async ({ page }) => {
    const initialRound = await helpers.getCurrentRound()
    
    await helpers.startRace()
    
    const isStarted = await helpers.isRaceStarted()
    expect(isStarted).toBe(true)
    
    await helpers.pauseRace()
    
    const isPaused = await helpers.isRaceStarted()
    expect(isPaused).toBe(false)
  })

  test('should reset race when reset button is clicked', async ({ page }) => {
    await helpers.startRace()
    await page.waitForTimeout(2000)
    
    await helpers.resetRace()
    
    const isStarted = await helpers.isRaceStarted()
    expect(isStarted).toBe(false)
    
    const currentRound = await helpers.getCurrentRound()
    expect(currentRound).toBe(1)
  })

  test('should change speed when speed buttons are clicked', async ({ page }) => {
    await helpers.setSpeed('Fast')
    
    const fastButton = page.locator('button:has-text("Fast")')
    const color = await fastButton.evaluate((el) => {
      const style = window.getComputedStyle(el)
      return style.backgroundColor
    })
    
    expect(color).not.toBe('rgba(0, 0, 0, 0)')
  })

  test('should disable speed buttons during race', async ({ page }) => {
    await helpers.startRace()
    
    const mediumButton = page.locator('button:has-text("Medium")')
    const fastButton = page.locator('button:has-text("Fast")')
    const veryFastButton = page.locator('button:has-text("Very Fast")')
    
    await expect(mediumButton).toBeDisabled()
    await expect(fastButton).toBeDisabled()
    await expect(veryFastButton).toBeDisabled()
  })

  test('should show horses moving during race', async ({ page }) => {
    await helpers.startRace()
    
    await page.waitForTimeout(3000)
    
    const positions = await helpers.getHorsePositions()
    expect(positions.length).toBeGreaterThan(0)
    
    const hasMovement = positions.some(horse => horse.position > 0)
    expect(hasMovement).toBe(true)
  })

  test('should complete a full race round', async ({ page }) => {
    await helpers.startRace()
    
    await helpers.waitForRaceFinish()
    
    const isFinished = await helpers.isRaceStarted()
    expect(isFinished).toBe(false)
  })

  test('should progress to next round after race completion', async ({ page }) => {
    const initialRound = await helpers.getCurrentRound()
    
    await helpers.startRace()
    await helpers.waitForRaceFinish()
    
    const nextRound = await helpers.getCurrentRound()
    expect(nextRound).toBe(initialRound + 1)
  })

  test('should handle multiple race rounds', async ({ page }) => {
    for (let round = 1; round <= 3; round++) {
      const currentRound = await helpers.getCurrentRound()
      expect(currentRound).toBe(round)
      
      await helpers.startRace()
      await helpers.waitForRaceFinish()
      
      await page.waitForTimeout(1000)
    }
  })
})
