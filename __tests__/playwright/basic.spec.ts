import { test, expect } from '@playwright/test';

test('Can open home page', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=More help and information').first()).toBeVisible();
});