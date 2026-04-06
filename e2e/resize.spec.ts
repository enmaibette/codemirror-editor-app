import { test, expect } from '@playwright/test';

// AC-08: Panes are Resizable

test.describe('Resizable panes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/challenge/1');
    // Wait for the editor to be present before testing resize
    await expect(page.getByRole('button', { name: /run/i })).toBeVisible();
  });

  test('AC-08 — horizontal resize handle between description and editor is present', async ({
    page,
  }) => {
    // react-resizable-panels renders a drag handle element
    const resizeHandles = page.locator('[data-panel-resize-handle-id]');
    await expect(resizeHandles.first()).toBeVisible();
  });

  test('AC-08 — dragging horizontal resize handle changes panel width', async ({ page }) => {
    const handles = page.locator('[data-panel-resize-handle-id]');
    const horizontalHandle = handles.first();

    await horizontalHandle.waitFor({ state: 'visible' });

    // Record initial bounding box of the description panel
    const descPanel = page.locator('[data-panel]').first();
    const beforeBox = await descPanel.boundingBox();

    // Drag the handle to the right by 100px
    const handleBox = await horizontalHandle.boundingBox();
    if (handleBox) {
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 + 100,
        handleBox.y + handleBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
    }

    const afterBox = await descPanel.boundingBox();

    // The width should have changed
    expect(afterBox?.width).not.toBe(beforeBox?.width);
  });

  test('AC-08 — editor remains visible after horizontal resize', async ({ page }) => {
    const handles = page.locator('[data-panel-resize-handle-id]');
    const horizontalHandle = handles.first();

    await horizontalHandle.waitFor({ state: 'visible' });

    const handleBox = await horizontalHandle.boundingBox();
    if (handleBox) {
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        handleBox.x + handleBox.width / 2 - 80,
        handleBox.y + handleBox.height / 2,
        { steps: 10 }
      );
      await page.mouse.up();
    }

    // CodeMirror editor container should still be visible
    await expect(page.locator('.cm-editor').first()).toBeVisible();
  });

  test('AC-08 — console panel remains visible after resize', async ({ page }) => {
    const handles = page.locator('[data-panel-resize-handle-id]');
    // There should be at least 2 handles: horizontal (left/right) and vertical (top/bottom)
    await expect(handles).toHaveCount(2);

    const verticalHandle = handles.nth(1);
    const handleBox = await verticalHandle.boundingBox();

    if (handleBox) {
      await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(
        handleBox.x + handleBox.width / 2,
        handleBox.y + handleBox.height / 2 - 50,
        { steps: 10 }
      );
      await page.mouse.up();
    }

    // Console tab bar should still be visible
    await expect(page.getByRole('tab', { name: /output/i })).toBeVisible();
  });
});
