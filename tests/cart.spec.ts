import { test, expect } from '@playwright/test';
import { addProductToCart } from './helpers';

test.describe('Cart', () => {
  test('add product to cart', async ({ page }) => {
    await addProductToCart(page);
    await expect(page.locator('div[role="listitem"]')).toHaveCount(1);
  });

  test('update quantity', async ({ page }) => {
    await addProductToCart(page);
    const initialQty = await page.locator('[data-testid="cart-drawer"] span.w-4').textContent();
    await page.locator('[data-testid="cart-drawer"] button:has(svg.lucide-plus)').first().click();
    await expect(page.locator('[data-testid="cart-drawer"] span.w-4')).toHaveText(
      (parseInt(initialQty || '1') + 1).toString(),
    );
  });

  test('remove product', async ({ page }) => {
    await addProductToCart(page);
    await page.locator('[data-testid="cart-drawer"]').getByRole('button', { name: /شيل/ }).click();
    await expect(page.getByText(/شنطتك فاضية دلوقتي/)).toBeVisible();
  });
});
