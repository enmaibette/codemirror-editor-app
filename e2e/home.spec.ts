import { test, expect } from '@playwright/test';

// AC-01: Home Screen Renders
// AC-10: Breadcrumb Navigation (home route shows only "Python OOP")

test.describe('Home screen', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('AC-01 — page shows "Python OOP" heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Python OOP' })).toBeVisible();
  });

  test('AC-01 — page shows exactly 4 challenge rows', async ({ page }) => {
    // Each ChallengeRow is a <button> element inside the challenge list
    const rows = page.getByRole('button').filter({ hasText: /dog|method|inheritance|bank/i });
    await expect(rows).toHaveCount(4);
  });

  test('AC-01 — all 4 challenge titles are visible', async ({ page }) => {
    await expect(page.getByText('Create a Class – Dog')).toBeVisible();
    await expect(page.getByText('Methode – Add a Method to the Dog class')).toBeVisible();
    await expect(page.getByText('Inheritance')).toBeVisible();
    await expect(page.getByText('Create a Simple Bank Account Class')).toBeVisible();
  });

  test('AC-10 — breadcrumb shows only "Python OOP" on home screen', async ({ page }) => {
    // "Python OOP" should appear in the breadcrumb/header area
    const breadcrumb = page.locator('header').getByText('Python OOP');
    await expect(breadcrumb).toBeVisible();
  });

  test('AC-10 — breadcrumb does NOT show "Challenge N" on home screen', async ({ page }) => {
    await expect(page.locator('header').getByText(/Challenge \d/)).not.toBeVisible();
  });

  test('AC-01 — app logo "</> PyOOP Learn" is visible', async ({ page }) => {
    await expect(page.getByText(/PyOOP Learn/)).toBeVisible();
  });

  test('AC-01 — Run button is present in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /run/i })).toBeVisible();
  });

  test('AC-01 — Submit button is present in the header', async ({ page }) => {
    await expect(page.getByRole('button', { name: /submit/i })).toBeVisible();
  });
});
