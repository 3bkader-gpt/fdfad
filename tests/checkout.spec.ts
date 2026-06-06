import { test, expect } from '@playwright/test';
import { addProductToCart } from './helpers';

test.describe('Checkout', () => {
  test('complete happy-path checkout', async ({ page }) => {
    await addProductToCart(page);
    await page.getByRole('link', { name: /إتمام الطلب/ }).click();

    await expect(page).toHaveURL(/\/checkout/);

    await page.getByLabel(/الاسم بالكامل/).fill('Test Customer');
    await page.getByLabel(/رقم الموبايل/).fill('01012345678');
    await page.getByLabel(/المحافظة/).selectOption({ label: 'القاهرة' });
    await page.getByLabel(/العنوان بالتفصيل/).fill('123 Test Street, Cairo, Egypt');

    await page.getByRole('button', { name: /تأكيد الطلب/ }).click();

    // Wait for success page
    await expect(page).toHaveURL(/\/checkout\/success/);
    await expect(page.getByText(/طلبك اتسجل بنجاح/)).toBeVisible();
  });

  test('validation errors appear correctly', async ({ page }) => {
    await addProductToCart(page);
    await page.getByRole('link', { name: /إتمام الطلب/ }).click();

    await page.getByRole('button', { name: /تأكيد الطلب/ }).click();

    await expect(page.getByText(/الاسم بالكامل مطلوب/)).toBeVisible();
    await expect(page.getByText(/ادخلي رقم موبايل مصري صحيح/)).toBeVisible();
  });
});
