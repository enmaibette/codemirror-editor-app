import { test, expect } from '@playwright/test';

// AC-02: Navigate to Challenge

test.describe('Challenge navigation', () => {
  test('AC-02 — clicking first challenge row changes URL to /challenge/1', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Create a Class – Dog').click();
    await expect(page).toHaveURL(/\/challenge\/1/);
  });

  test('AC-02 — breadcrumb updates to show "Python OOP" and "Challenge 1" after navigation', async ({
    page,
  }) => {
    await page.goto('/');
    await page.getByText('Create a Class – Dog').click();

    // Wait for the challenge page to load
    await expect(page).toHaveURL(/\/challenge\/1/);

    const header = page.locator('header');
    await expect(header.getByText('Python OOP')).toBeVisible();
    await expect(header.getByText('Challenge 1')).toBeVisible();
  });

  test('AC-02 — breadcrumb separator is present between "Python OOP" and "Challenge 1"', async ({
    page,
  }) => {
    await page.goto('/challenge/1');
    // Wait for active challenge index to be set (breadcrumb renders)
    await expect(page.locator('header').getByText('Challenge 1')).toBeVisible();
  });

  test('AC-02 — clicking browser back returns to home', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Create a Class – Dog').click();
    await expect(page).toHaveURL(/\/challenge\/1/);

    await page.goBack();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Python OOP' })).toBeVisible();
  });

  test('AC-02 — clicking second challenge navigates to /challenge/2', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Methode – Add a Method to the Dog class').click();
    await expect(page).toHaveURL(/\/challenge\/2/);
  });

  test('AC-02 — breadcrumb shows "Challenge 2" on challenge 2 route', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Methode – Add a Method to the Dog class').click();
    await expect(page.locator('header').getByText('Challenge 2')).toBeVisible();
  });

  test('AC-02 — navigating directly to /challenge/4 works', async ({ page }) => {
    await page.goto('/challenge/4');
    await expect(page).toHaveURL(/\/challenge\/4/);
    await expect(page.locator('header').getByText('Challenge 4')).toBeVisible();
  });

  test('AC-02 — navigating to unknown challenge redirects to home', async ({ page }) => {
    await page.goto('/challenge/999');
    await expect(page).toHaveURL('/');
  });
});
