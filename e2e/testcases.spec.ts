import { test, expect } from '@playwright/test';

// AC-07: Test Cases Tab Displays Cards

test.describe('Test Cases tab', () => {
  test.beforeEach(async ({ page }) => {
    // Challenge 4 (BankAccount) has 3 test cases
    await page.goto('/challenge/4');
    await expect(page.getByRole('button', { name: /run/i })).toBeVisible();
  });

  test('AC-07 — clicking "Test Cases" tab shows the test case content area', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();
    const testCasesTab = page.getByRole('tab', { name: /test cases/i });
    await expect(testCasesTab).toHaveAttribute('data-state', 'active');
  });

  test('AC-07 — 3 test case cards are visible for challenge 4', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();

    // Each card renders the test case title
    await expect(page.getByText('Test Case 1: Basic deposit and withdrawal')).toBeVisible();
    await expect(page.getByText('Test Case 2: Insufficient balance')).toBeVisible();
    await expect(page.getByText('Test Case 3: Multiple operations')).toBeVisible();
  });

  test('AC-07 — each card shows "Expected:" label', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();

    const expectedLabels = page.getByText(/Expected:/);
    await expect(expectedLabels).toHaveCount(3);
  });

  test('AC-07 — each card shows "Got:" label', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();

    const gotLabels = page.getByText(/Got:/);
    await expect(gotLabels).toHaveCount(3);
  });

  test('AC-07 — test case cards show correct expected values', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();

    await expect(page.getByText('1300').first()).toBeVisible();
    await expect(page.getByText('No withdrawal')).toBeVisible();
  });

  test('AC-07 — cards show pending status icons (SVG elements present)', async ({ page }) => {
    await page.getByRole('tab', { name: /test cases/i }).click();

    // Each TestCaseCard renders a StatusIcon (SVG)
    const svgIcons = page
      .locator('[data-state="active"] svg')
    await expect(svgIcons.first()).toBeVisible();
  });
});
