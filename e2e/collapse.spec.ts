import { test, expect } from '@playwright/test';

// AC-09: Left Panel is Collapsible

test.describe('Left panel collapse', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/1');
    // Wait for the page to fully render
    await expect(page.getByRole('button', { name: /close description panel/i })).toBeVisible();
  });

  test('AC-09 — description panel is visible initially', async ({ page }) => {
    // The description panel contains the Description/Hint tabs
    await expect(page.getByRole('tab', { name: /description/i })).toBeVisible();
  });

  test('AC-09 — clicking X close button hides the description panel', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: /close description panel/i });
    await closeButton.click();

    // The Description tab trigger should no longer be visible
    await expect(page.getByRole('tab', { name: /description/i })).not.toBeVisible();
  });

  test('AC-09 — editor is still visible after closing description panel', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: /close description panel/i });
    await closeButton.click();

    await expect(page.locator('.cm-editor').first()).toBeVisible();
  });

  test('AC-09 — console panel is still visible after closing description panel', async ({
    page,
  }) => {
    const closeButton = page.getByRole('button', { name: /close description panel/i });
    await closeButton.click();

    await expect(page.getByRole('tab', { name: /output/i })).toBeVisible();
  });

  test('AC-09 — editor expands to take more horizontal space after panel close', async ({
    page,
  }) => {
    // Record the editor width before collapse
    const editorContainer = page.locator('.cm-editor').first();
    const beforeBox = await editorContainer.boundingBox();

    const closeButton = page.getByRole('button', { name: /close description panel/i });
    await closeButton.click();

    // Give the layout time to re-render
    await page.waitForTimeout(300);

    const afterBox = await editorContainer.boundingBox();

    // Editor should be wider after the left panel collapses
    expect(afterBox?.width).toBeGreaterThan(beforeBox?.width ?? 0);
  });

  test('AC-09 — horizontal resize handle disappears after panel close', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: /close description panel/i });
    await closeButton.click();

    await page.waitForTimeout(200);

    // After collapse, only 1 resize handle remains (the vertical editor/console split)
    const handles = page.locator('[data-panel-resize-handle-id]');
    await expect(handles).toHaveCount(1);
  });

  test('AC-09 — close then reopen from sidebar keeps close behavior consistent', async ({ page }) => {
    await page.getByRole('button', { name: /close description panel/i }).click();
    await expect(page.getByRole('tab', { name: /description/i })).not.toBeVisible();

    await page.getByRole('button', { name: /hints/i }).click();
    await expect(page.getByRole('tab', { name: /description/i })).toBeVisible();

    await page.getByRole('button', { name: /close description panel/i }).click();
    await expect(page.getByRole('tab', { name: /description/i })).not.toBeVisible();
  });
});
