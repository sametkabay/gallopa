import { Page, expect } from '@playwright/test'

export class TestHelpers {
  constructor(private page: Page) {}

  async waitForAppLoad() {
    await this.page.waitForLoadState('networkidle')
    await this.page.waitForSelector('.app', { timeout: 10000 })
  }

  async getHorseCount() {
    return await this.page.locator('.horse-list .horse').count()
  }

  async getRoundCount() {
    return await this.page.locator('.round-list .round').count()
  }

  async isRaceStarted() {
    const startButton = this.page.locator('button:has-text("Start Round")')
    const pauseButton = this.page.locator('button:has-text("Pause")')
    
    return await pauseButton.isVisible()
  }

  async startRace() {
    const startButton = this.page.locator('button:has-text("Start Round")')
    await startButton.click()
    await this.page.waitForTimeout(1000)
  }

  async pauseRace() {
    const pauseButton = this.page.locator('button:has-text("Pause")')
    await pauseButton.click()
    await this.page.waitForTimeout(1000)
  }

  async resetRace() {
    const resetButton = this.page.locator('button:has-text("Reset")')
    await resetButton.click()
    await this.page.waitForTimeout(1000)
  }

  async setSpeed(speed: 'Medium' | 'Fast' | 'Very Fast') {
    const speedButton = this.page.locator(`button:has-text("${speed}")`)
    await speedButton.click()
    await this.page.waitForTimeout(500)
  }

  async getCurrentRound() {
    const roundText = await this.page.locator('button:has-text("Start Round")').textContent()
    const match = roundText?.match(/Start Round (\d+)/)
    return match ? parseInt(match[1]) : 1
  }

  async waitForRaceFinish() {
    await this.page.waitForSelector('button:has-text("Start Round")', { timeout: 30000 })
  }

  async getHorsePositions() {
    const horses = await this.page.locator('.arena .line').all()
    const positions: { id: string; position: number }[] = []
    
    for (let i = 0; i < horses.length; i++) {
      const horse = horses[i]
      const style = await horse.getAttribute('style')
      const match = style?.match(/left:\s*(\d+)px/)
      if (match) {
        positions.push({
          id: await horse.getAttribute('data-horse-id') || '',
          position: parseInt(match[1])
        })
      }
    }
    
    return positions.sort((a, b) => b.position - a.position)
  }
}
