import { test, expect } from '@playwright/test';

// AC-06: Run Button Triggers Output

test.describe('Run button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/1');
    // Wait for page to be fully rendered
    await expect(page.getByRole('button', { name: /run/i })).toBeVisible();
  });

  test('AC-06 — clicking "Run" makes Output tab active', async ({ page }) => {
    await page.getByRole('button', { name: /run/i }).click();

    // The Output tab trigger should become active
    const outputTab = page.getByRole('tab', { name: /output/i });
    await expect(outputTab).toHaveAttribute('data-state', 'active');
  });

  test('AC-06 — console shows "> Running code..." after Run is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /run/i }).click();

    await expect(page.getByText(/> Running code\.\.\./)).toBeVisible();
  });

  test('AC-06 — console shows "// Your output will appear here" after Run is clicked', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /run/i }).click();

    await expect(page.getByText(/\/\/ Your output will appear here/)).toBeVisible();
  });

  test('AC-06 — Output tab content area is visible after clicking Run', async ({ page }) => {
    await page.getByRole('button', { name: /run/i }).click();

    // The console panel content area should be visible
    const consoleContent = page.locator('[data-state="active"]').filter({ hasText: /Running/ });
    await expect(consoleContent).toBeVisible();
  });

  test('AC-06 — no actual Python execution occurs (output is placeholder text only)', async ({
    page,
  }) => {
    await page.getByRole('button', { name: /run/i }).click();

    // Should NOT contain any executed Python result, only the prototype placeholder
    await expect(page.getByText(/SyntaxError|Traceback|Exception/)).not.toBeVisible();
  });
});
