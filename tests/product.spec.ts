import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should display product details correctly', async ({ page }) => {
    await page.goto('/ar');
    await page.locator('#collection .grid > a').first().click();

    // Check that the main product title is visible
    await expect(page.locator('main h2').first()).toBeVisible();
    await expect(
      page.getByTestId('add-to-cart-button').filter({ visible: true }).first(),
    ).toBeVisible();
  });
  test('variant selection works', async ({ page }) => {
    await page.goto('/ar');
    await page.locator('#collection .grid > a').first().click();
    await expect(page.locator('main h2').first()).toBeVisible();

    const sizeButton = page.locator('.flex.flex-wrap.gap-3 button').first();
    if (await sizeButton.isVisible()) {
      await sizeButton.click();
      await expect(sizeButton).toHaveClass(/bg-brand-primary/);
    }
  });

  test('gallery zoom works', async ({ page }) => {
    await page.goto('/ar');
    await page.locator('#collection .grid > a').first().click();

    await page.getByRole('button', { name: /تكبير الصورة/ }).click();
    await expect(page.getByRole('dialog', { name: 'Image Zoom' })).toBeVisible();
    await page.getByRole('button', { name: 'Close zoom' }).click();
    await expect(page.getByRole('dialog', { name: 'Image Zoom' })).not.toBeVisible();
  });
});
