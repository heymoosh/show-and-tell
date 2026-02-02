import { test, expect } from '@playwright/test';

test.describe('Workbench Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for React to load
    await page.waitForSelector('[data-testid="workbench-landing"]');
  });

  test('should load the landing page successfully', async ({ page }) => {
    // Check for main heading
    await expect(page.locator('[data-testid="main-title"]')).toContainText('SHOW');
    await expect(page.locator('[data-testid="main-title"]')).toContainText('& TELL');
  });

  test('should display the tagline', async ({ page }) => {
    const tagline = page.locator('[data-testid="tagline"]');
    await expect(tagline).toBeVisible();
    await expect(tagline).toContainText('Interactive simulations');
  });

  test('should display the Yard Sale portal', async ({ page }) => {
    const cardGrid = page.locator('[data-testid="card-grid"]');
    await expect(cardGrid).toBeVisible();

    // Check for the Yard Sale portal
    await expect(page.locator('[data-testid="portal-the-yard-sale"]')).toBeVisible();
  });

  test('should display the footer', async ({ page }) => {
    const footer = page.locator('[data-testid="footer"]');
    await expect(footer).toBeVisible();
    await expect(footer).toContainText('v1.0.0');
    await expect(footer).toContainText('Designed for exploration');
  });

  test('should navigate to oligarchy simulation when portal is clicked', async ({ page }) => {
    // Click on the Yard Sale portal
    await page.locator('[data-testid="portal-the-yard-sale"]').click();

    // Wait for navigation to simulation
    await page.waitForSelector('h2:has-text("The Yard Sale Model")');

    // Verify we're on the simulation page
    await expect(page.locator('h2')).toContainText('The Yard Sale Model');
    await expect(page.locator('text=Economic Physics')).toBeVisible();
  });

  test('should display back button on simulation page', async ({ page }) => {
    // Navigate to simulation
    await page.locator('[data-testid="portal-the-yard-sale"]').click();
    await page.waitForSelector('[data-testid="back-button"]');

    // Check back button exists
    await expect(page.locator('[data-testid="back-button"]')).toBeVisible();
    await expect(page.locator('[data-testid="back-button"]')).toContainText('Back to Workbench');
  });

  test('should navigate back to landing when back button is clicked', async ({ page }) => {
    // Navigate to simulation
    await page.locator('[data-testid="portal-the-yard-sale"]').click();
    await page.waitForSelector('[data-testid="back-button"]');

    // Click back button
    await page.locator('[data-testid="back-button"]').click();

    // Should be back on landing page
    await page.waitForSelector('[data-testid="workbench-landing"]');
    await expect(page.locator('[data-testid="main-title"]')).toContainText('SHOW');
  });

  test('should have wood texture background', async ({ page }) => {
    // The background should be set via inline style with the wood texture
    const background = page.locator('[data-testid="workbench-landing"] > div').first();
    const style = await background.getAttribute('style');
    expect(style).toContain('workbench_background.png');
  });

  test('portal should have hover effect', async ({ page }) => {
    const portal = page.locator('[data-testid="portal-the-yard-sale"]');

    // Get initial transform
    const initialStyle = await portal.evaluate(el => getComputedStyle(el).transform);

    // Hover over portal
    await portal.hover();

    // Wait for transition
    await page.waitForTimeout(350);

    // Get new transform - should be scaled up
    const hoveredStyle = await portal.evaluate(el => getComputedStyle(el).transform);

    // The transform should have changed (scale effect)
    expect(hoveredStyle).not.toBe(initialStyle);
  });
});

test.describe('Landing to Simulation Flow', () => {
  test('complete user journey: landing -> simulation -> back', async ({ page }) => {
    // Start at landing
    await page.goto('/');
    await page.waitForSelector('[data-testid="workbench-landing"]');

    // Verify landing page
    await expect(page.locator('[data-testid="main-title"]')).toContainText('SHOW');

    // Click Yard Sale portal
    await page.locator('[data-testid="portal-the-yard-sale"]').click();

    // Wait for simulation to load
    await page.waitForSelector('h2:has-text("The Yard Sale Model")');

    // Verify simulation page elements
    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.locator('button[aria-label="Play"]')).toBeVisible();

    // Play the simulation briefly
    await page.locator('button[aria-label="Play"]').click();
    await page.waitForTimeout(500);

    // Pause and verify round counter increased
    await page.locator('button[aria-label="Pause"]').click();
    const roundText = await page.locator('text=/Round: \\d+/').textContent();
    const match = roundText.match(/(\d|,)+/);
    const roundNumber = parseInt(match ? match[0].replace(/,/g, '') : '0');
    expect(roundNumber).toBeGreaterThan(0);

    // Go back to landing
    await page.locator('[data-testid="back-button"]').click();
    await page.waitForSelector('[data-testid="workbench-landing"]');

    // Verify we're back at landing
    await expect(page.locator('[data-testid="main-title"]')).toContainText('SHOW');
    await expect(page.locator('[data-testid="portal-the-yard-sale"]')).toBeVisible();
  });

  test('landing page should be accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="workbench-landing"]');

    // Check for semantic HTML structure
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();

    // Check heading hierarchy
    await expect(page.locator('h1')).toBeVisible();
  });

  test('portal should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="workbench-landing"]');

    const portal = page.locator('[data-testid="portal-the-yard-sale"]');

    // Portal should be focusable
    await portal.focus();
    await expect(portal).toBeFocused();

    // Should have proper ARIA label
    await expect(portal).toHaveAttribute('aria-label', 'Open The Yard Sale simulation');

    // Should navigate on Enter key
    await page.keyboard.press('Enter');
    await page.waitForSelector('h2:has-text("The Yard Sale Model")');
    await expect(page.locator('h2')).toContainText('The Yard Sale Model');
  });
});
