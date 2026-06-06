import { test, expect } from '@playwright/test';

test.describe('Localization', () => {
  test('arabic routes work', async ({ page }) => {
    await page.goto('/ar');
    await expect(page.getByRole('heading', { name: 'فضفاض' })).toBeVisible();
  });

  test('english routes work', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByRole('heading', { name: 'Fadfaad' })).toBeVisible();
  });

  test('language switching works', async ({ page }) => {
    await page.goto('/ar');
    await page.getByRole('button', { name: /Switch to English/ }).click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.getByRole('heading', { name: 'Fadfaad' })).toBeVisible();

    await page.getByRole('button', { name: /التغيير إلى العربية/ }).click();
    // Arabic is default, prefix might be missing
    await expect(page).toHaveURL(/\/ar|localhost:3000\/$/);
    await expect(page.getByRole('heading', { name: 'فضفاض' })).toBeVisible();
  });
});
