import { test, expect } from '@playwright/test';

// AC-03: Editor Loads with Starter Code

test.describe('CodeMirror editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/1');
  });

  test('AC-03 — editor container is visible', async ({ page }) => {
    const editorContainer = page.locator('.cm-editor').first();
    await expect(editorContainer).toBeVisible({ timeout: 10_000 });
  });

  test('AC-03 — editor is pre-populated with starter code (not empty)', async ({ page }) => {
    const editorContent = page.locator('.cm-content').first();
    await expect(editorContent).not.toBeEmpty({ timeout: 10_000 });
  });

  test('AC-03 — starter code contains "class Dog"', async ({ page }) => {
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });
    const editorContent = page.locator('.cm-content');
    await expect(editorContent).toContainText('class Dog', { timeout: 10_000 });
  });

  test('AC-03 — starter code contains "__init__"', async ({ page }) => {
    await page.waitForSelector('.cm-editor', { timeout: 10_000 });
    const editorContent = page.locator('.cm-content');
    await expect(editorContent).toContainText('__init__', { timeout: 10_000 });
  });

  test('AC-03 — editor sidebar (Files button) is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /files/i })).toBeVisible();
  });

  test('AC-03 — editor sidebar (Hints button) is visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: /hints/i })).toBeVisible();
  });
});
