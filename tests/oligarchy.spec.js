import { test, expect } from '@playwright/test';

test.describe('Oligarchy Simulation - Yard Sale Model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for landing page to load
    await page.waitForSelector('[data-testid="workbench-landing"]');
    // Navigate to oligarchy simulation
    await page.locator('[data-testid="card-oligarchy"]').click();
    // Wait for simulation to load
    await page.waitForSelector('h2:has-text("The Yard Sale Model")');
  });

  test('should load the application successfully', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('h2')).toContainText('The Yard Sale Model');

    // Check for sidebar
    await expect(page.locator('h1')).toContainText('Show & Tell');

    // Check for Economic Physics badge
    await expect(page.locator('text=Economic Physics')).toBeVisible();
  });

  test('should have all three tabs visible', async ({ page }) => {
    await expect(page.locator('button:has-text("Simulation")')).toBeVisible();
    await expect(page.locator('button:has-text("Explanation")')).toBeVisible();
    await expect(page.locator('button:has-text("Deep Dive")')).toBeVisible();
  });

  test('should start in Simulation tab', async ({ page }) => {
    const simulationButton = page.locator('button:has-text("Simulation")');
    await expect(simulationButton).toHaveClass(/bg-white/);
  });

  test('should display the bubble visualizer canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();

    // Check canvas has reasonable dimensions
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(400);
    expect(box.height).toBeGreaterThan(300);
  });

  test('should have play/pause and reset controls', async ({ page }) => {
    // Check for play button
    const playButton = page.locator('button[aria-label="Play"]');
    await expect(playButton).toBeVisible();

    // Check for reset button
    const resetButton = page.locator('button[aria-label="Reset"]');
    await expect(resetButton).toBeVisible();
  });

  test('should display round counter starting at 0', async ({ page }) => {
    const roundCounter = page.locator('text=/Round: \\d+/');
    await expect(roundCounter).toContainText('Round: 0');
  });

  test('should start simulation when play button is clicked', async ({ page }) => {
    const playButton = page.locator('button[aria-label="Play"]');
    await playButton.click();

    // Check button changed to pause
    const pauseButton = page.locator('button[aria-label="Pause"]');
    await expect(pauseButton).toBeVisible();

    // Wait a bit and check if round counter increased
    await page.waitForTimeout(500);
    const roundCounter = page.locator('text=/Round: \\d+/');
    const roundText = await roundCounter.textContent();
    const match = roundText.match(/(\d|,)+/);
    const roundNumber = parseInt(match ? match[0].replace(/,/g, '') : '0');
    expect(roundNumber).toBeGreaterThan(0);
  });

  test('should pause simulation when pause button is clicked', async ({ page }) => {
    // Start simulation
    const playButton = page.locator('button[aria-label="Play"]');
    await playButton.click();

    await page.waitForTimeout(500);

    // Pause
    const pauseButton = page.locator('button[aria-label="Pause"]');
    await pauseButton.click();

    // Get current round
    await page.waitForTimeout(100);
    const roundText1 = await page.locator('text=/Round: \\d+/').textContent();
    const match1 = roundText1.match(/(\d|,)+/);
    const round1 = parseInt(match1 ? match1[0].replace(/,/g, '') : '0');

    // Wait and check round didn't increase
    await page.waitForTimeout(500);
    const roundText2 = await page.locator('text=/Round: \\d+/').textContent();
    const match2 = roundText2.match(/(\d|,)+/);
    const round2 = parseInt(match2 ? match2[0].replace(/,/g, '') : '0');

    expect(round2).toBe(round1);
  });

  test('should reset simulation when reset button is clicked', async ({ page }) => {
    // Start simulation
    await page.locator('button[aria-label="Play"]').click();
    await page.waitForTimeout(500);

    // Reset
    await page.locator('button[aria-label="Reset"]').click();

    // Check round counter is back to 0
    await expect(page.locator('text=/Round: 0/')).toBeVisible();

    // Check simulation is paused
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();
  });

  test('should display all three metric cards', async ({ page }) => {
    await expect(page.locator('text=Top 1% Share')).toBeVisible();
    await expect(page.locator('text=Wealth Gap')).toBeVisible();
    await expect(page.locator('text=Active Agents')).toBeVisible();
  });

  test('should display leaderboard with agents', async ({ page }) => {
    await expect(page.locator('text=Live Leaderboard')).toBeVisible();

    // Should have at least a few agents listed
    const agentEntries = page.locator('text=/Agent \\d+/');
    await expect(agentEntries.first()).toBeVisible();
  });

  test('should have parameter controls', async ({ page }) => {
    await expect(page.locator('text=Parameters')).toBeVisible();

    // Check for specific controls
    await expect(page.locator('text=/Population Size/')).toBeVisible();
    await expect(page.locator('text=/Transfer Rate/')).toBeVisible();
    await expect(page.locator('text=/Initial Wealth/')).toBeVisible();
  });

  test('should adjust population size slider', async ({ page }) => {
    const slider = page.locator('input[type="range"]').first();
    await slider.fill('200');

    // Check label updated
    await page.waitForTimeout(100);
    await expect(page.locator('text=/Population Size \\(\\d+\\)/')).toBeVisible();
  });

  test('should display instructional info box', async ({ page }) => {
    await expect(page.locator('text=What am I looking at?')).toBeVisible();
    await expect(page.locator('text=/fair 50\\/50 coin flip/')).toBeVisible();
  });

  test('should switch to Explanation tab', async ({ page }) => {
    const explanationTab = page.locator('button:has-text("Explanation")');
    await explanationTab.click();

    // Wait for tab transition
    await page.waitForTimeout(300);

    // Check tab is active
    await expect(explanationTab).toHaveClass(/bg-white/);

    // Check for explanation content
    await expect(page.locator('h2:has-text("The Mathematics of Oligarchy")')).toBeVisible();
  });

  test('should switch to Deep Dive tab', async ({ page }) => {
    const deepDiveTab = page.locator('button:has-text("Deep Dive")');
    await deepDiveTab.click();

    // Check tab is active
    await expect(deepDiveTab).toHaveClass(/bg-white/);

    // Should show the original detailed analysis component
    // (This will load the existing YardSaleSimulation component)
  });

  test('should run simulation for extended period and show wealth concentration', async ({ page }) => {
    // Start simulation
    await page.locator('button[aria-label="Play"]').click();

    // Wait for simulation to run
    await page.waitForTimeout(3000);

    // Check that round counter has increased significantly
    const roundText = await page.locator('text=/Round: \\d+/').textContent();
    const match = roundText.match(/(\d|,)+/);
    const roundNumber = parseInt(match ? match[0].replace(/,/g, '') : '0');
    expect(roundNumber).toBeGreaterThan(50);

    // Check that Top 1% Share has increased from initial
    const top1Text = await page.locator('text=/\\d+\\.\\d+%/').first().textContent();
    const top1Share = parseFloat(top1Text);
    // In a fair start, top 1% should accumulate more than their fair share
    expect(top1Share).toBeGreaterThan(1); // More than 1% of total wealth
  });

  test('should handle canvas clicks for agent selection', async ({ page }) => {
    const canvas = page.locator('canvas');

    // Click somewhere on canvas
    await canvas.click({ position: { x: 400, y: 250 } });

    // Wait a moment for selection to register
    await page.waitForTimeout(300);

    // Note: Actual selection detection would depend on where agents are positioned
    // This is a basic interaction test
  });

  test('should adjust simulation speed', async ({ page }) => {
    const speedSlider = page.locator('input[aria-label="Simulation speed"]');
    await expect(speedSlider).toBeVisible();

    // Start simulation
    await page.locator('button[aria-label="Play"]').click();

    // Change speed
    await speedSlider.fill('150');

    // Simulation should continue running
    await page.waitForTimeout(500);
    const roundText = await page.locator('text=/Round: \\d+/').textContent();
    const match = roundText.match(/(\d|,)+/);
    const roundNumber = parseInt(match ? match[0].replace(/,/g, '') : '0');
    expect(roundNumber).toBeGreaterThan(0);
  });

  test('should maintain simulation state when switching tabs', async ({ page }) => {
    // Start simulation
    await page.locator('button[aria-label="Play"]').click();
    await page.waitForTimeout(500);

    // Get current round
    const roundText1 = await page.locator('text=/Round: \\d+/').textContent();
    const match1 = roundText1.match(/(\d|,)+/);
    const round1 = parseInt(match1 ? match1[0].replace(/,/g, '') : '0');

    // Switch to explanation tab
    await page.locator('button:has-text("Explanation")').click();
    await page.waitForTimeout(300);
    await expect(page.locator('h2:has-text("The Mathematics of Oligarchy")')).toBeVisible();

    // Switch back to simulation
    await page.locator('button:has-text("Simulation")').click();

    // Simulation should still be running
    await page.waitForTimeout(300);
    const roundText2 = await page.locator('text=/Round: \\d+/').textContent();
    const match2 = roundText2.match(/(\d|,)+/);
    const round2 = parseInt(match2 ? match2[0].replace(/,/g, '') : '0');

    expect(round2).toBeGreaterThan(round1);
  });

  test('should display sidebar navigation', async ({ page }) => {
    await expect(page.locator('text=Interactive Systems Lab')).toBeVisible();

    // Check simulation links
    await expect(page.locator('text=Oligarchy')).toBeVisible();
    await expect(page.locator('text=Segregation')).toBeVisible();
    await expect(page.locator('text=Epidemics')).toBeVisible();
  });

  test('should show wealth gap increasing over time', async ({ page }) => {
    // Reset to start fresh
    await page.locator('button[aria-label="Reset"]').click();

    // Get initial wealth gap
    await page.waitForTimeout(200);
    const initialGapText = await page.locator('div:has-text("Wealth Gap") >> text=/\\d+x/').textContent();
    const initialGap = parseInt(initialGapText);

    // Run simulation
    await page.locator('button[aria-label="Play"]').click();
    await page.waitForTimeout(2000);

    // Get new wealth gap
    const newGapText = await page.locator('div:has-text("Wealth Gap") >> text=/\\d+x/').textContent();
    const newGap = parseInt(newGapText);

    // Wealth gap should increase
    expect(newGap).toBeGreaterThan(initialGap);
  });
});
