import { test, expect } from '@playwright/test';

test.describe('Admin', () => {
  test('login page loads', async ({ page }) => {
    await page.goto('/ar/admin/login');
    await expect(page.getByText(/Admin Portal/)).toBeVisible();
  });

  test('admin dashboard redirects to login if unauthenticated', async ({ page }) => {
    await page.goto('/ar/admin');
    // It should redirect to login if not logged in
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});
