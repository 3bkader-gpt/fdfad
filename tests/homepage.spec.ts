import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully in Arabic', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.getByRole('heading', { name: 'فضفاض', exact: true })).toBeVisible();
    await expect(page.locator('#collection')).toBeVisible();
  });

  test('should load successfully in English', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { name: 'Fadfaad' })).toBeVisible();
    await expect(page.locator('#collection')).toBeVisible();
  });

  test('should render featured products', async ({ page }) => {
    await page.goto('/ar');
    const products = page.locator('#collection .grid > a');
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  });
});
