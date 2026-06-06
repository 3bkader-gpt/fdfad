import { expect, Page } from '@playwright/test';

export async function addProductToCart(page: Page) {
  // Navigate to first product on homepage
  await page.goto('/ar');
  const firstProduct = page.locator('#collection .grid > a').first();
  await firstProduct.click();

  // Wait for PDP
  await expect(page).toHaveURL(/\/products\//);
  await expect(page.locator('main h2').first()).toBeVisible();

  // Select size if available
  const sizeButton = page.locator('.flex.flex-wrap.gap-3 button').first();
  if (await sizeButton.isVisible()) {
    await sizeButton.click();
  }

  // Select color if available
  const colorButton = page.locator('.flex.flex-wrap.gap-4 button').first();
  if (await colorButton.isVisible()) {
    await colorButton.click();
  }

  // Add to cart
  const addToCartButton = page.getByTestId('add-to-cart-button').filter({ visible: true }).first();
  await addToCartButton.click();

  // Wait for cart drawer
  await expect(page.getByTestId('cart-drawer')).toBeVisible();
}
