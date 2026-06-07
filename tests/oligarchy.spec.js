import { test, expect } from '@playwright/test';

/**
 * Yard Sale Model — scroll-driven narrative redesign.
 * One canonical engine drives both the pinned bubble sim and the statistics.
 */
test.describe('Oligarchy Simulation - Yard Sale Model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="workbench-landing"]');
    await page.locator('[data-testid="portal-the-yard-sale"]').click();
    // Hero kicker confirms the page loaded.
    await page.waitForSelector('text=The Yard Sale Model');
  });

  test('loads the redesigned yard sale page', async ({ page }) => {
    await expect(page.locator('h1').first()).toContainText('oligarchy');
    await expect(page.locator('text=The Yard Sale Model')).toBeVisible();
  });

  test('has a working back button', async ({ page }) => {
    await page.locator('[data-testid="back-button"]').click();
    await expect(page.locator('[data-testid="workbench-landing"]')).toBeVisible();
  });

  test('displays the bubble visualizer canvas', async ({ page }) => {
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible();
    const box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(300);
    expect(box.height).toBeGreaterThan(200);
  });

  test('has play/pause and reset controls', async ({ page }) => {
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();
    await expect(page.locator('button[aria-label="Reset"]')).toBeVisible();
  });

  test('round counter starts at 0', async ({ page }) => {
    await expect(page.locator('text=/round\\s+0/i').first()).toBeVisible();
  });

  test('play starts the simulation and pause stops it', async ({ page }) => {
    await page.locator('button[aria-label="Play"]').click();
    await expect(page.locator('button[aria-label="Pause"]')).toBeVisible();

    await page.waitForTimeout(700);
    const readRound = async () => {
      const txt = await page.locator('.ys-round-pill').textContent();
      return parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
    };
    const r1 = await readRound();
    expect(r1).toBeGreaterThan(0);

    await page.locator('button[aria-label="Pause"]').click();
    await page.waitForTimeout(100);
    const r2 = await readRound();
    await page.waitForTimeout(500);
    const r3 = await readRound();
    expect(r3).toBe(r2);
  });

  test('reset returns the round counter to 0', async ({ page }) => {
    await page.locator('button[aria-label="Play"]').click();
    await page.waitForTimeout(500);
    await page.locator('button[aria-label="Reset"]').click();
    await expect(page.locator('text=/round\\s+0/i').first()).toBeVisible();
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();
  });

  test('shows the live metric cards', async ({ page }) => {
    await expect(page.locator('text=Gini').first()).toBeVisible();
    await expect(page.locator('text=Top 1% owns')).toBeVisible();
    await expect(page.locator('text=Ruined').first()).toBeVisible();
  });

  test('has interactive parameter controls', async ({ page }) => {
    await expect(page.locator('input[aria-label="Stake percent"]')).toBeVisible();
    await expect(page.locator('input[aria-label="Simulation speed"]')).toBeVisible();
  });

  test('scrolling drives the simulation forward without pressing play', async ({ page }) => {
    // Bring the last narrative step into view; scroll-driving should advance the sim.
    await page.locator('.ys-step').last().scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    const txt = await page.locator('.ys-round-pill').textContent();
    const round = parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
    expect(round).toBeGreaterThan(0);
  });

  test('surfaces the climax insight and reality-check sections', async ({ page }) => {
    await expect(page.locator('text=/not about winning/i')).toBeVisible();
    await expect(page.locator('text=Does this actually happen?')).toBeVisible();
  });

  test('reveals the deep analytics evidence locker on demand', async ({ page }) => {
    const toggle = page.locator('button:has-text("evidence locker")');
    await toggle.scrollIntoViewIfNeeded();
    await toggle.click();
    // The ensemble computes after first paint; allow time then assert a chart/table appears.
    await expect(page.locator('text=When are fates sealed?')).toBeVisible({ timeout: 10000 });
  });

  test('corrects the citation (no Chakraborti-mislabelled review link)', async ({ page }) => {
    // The 0905.1518 review is now attributed to Yakovenko & Rosser, not Chakraborti.
    const yakovenkoLink = page.locator('a[href*="0905.1518"]').first();
    await yakovenkoLink.scrollIntoViewIfNeeded();
    await expect(yakovenkoLink).toContainText(/Yakovenko/i);
  });
});
