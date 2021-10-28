import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Go to the starting url before each test.
  await page.goto('/');
});

test('Can open home page', async ({ page }) => {
  await expect(page.locator('text=More help and information').first()).toBeVisible();
});

test('Can goto contact page', async ({ page }) => {
  await page.click('text=CONTACT');
  await expect(page.locator('id=googleContactForm')).toBeVisible();
});

test('Can goto about page', async ({ page }) => {
  await page.click('id=aboutProject');
  await expect(page.locator('"What is PepVEP"')).toBeVisible();
});

test('Can search by VCF', async ({ page }) => {
  await page.click('id=vcfExampleButton');
  await page.click('id=searchButton');
  await expect(page.locator('id=resultTable')).toBeVisible();
});

test('Can search by HGVS', async ({ page }) => {
  await page.click('id=hgvsExampleButton');
  await page.click('id=searchButton');
  await expect(page.locator('id=resultTable')).toBeVisible();
});