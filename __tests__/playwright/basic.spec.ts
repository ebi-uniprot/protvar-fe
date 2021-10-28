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

test('Can upload File VCF format', async ({ page }) => {
  // Upload buffer from memory
  await page.setInputFiles('input#myInput', {
    name: 'file.vcf',
    mimeType: 'text/plain',
    buffer: Buffer.from('19 1010539 G C\n14 89993420 A/G\n10 87933147 rs7565837 C/T')
  });
  await expect(page.locator('id=resultTable')).toBeVisible();
});

test('Can upload File HGVS format', async ({ page }) => {
  await page.setInputFiles('input#myInput', {
    name: 'file.hgvs',
    mimeType: 'text/plain',
    buffer: Buffer.from('NC_000019.10:g.1010539G>C\nNC_000014.9:g.89993420A>G\nNC_000010.11:g.87933147C>T')
  });
  await expect(page.locator('id=resultTable')).toBeVisible();
});

test('Can open api documentation in new tab', async ({ page, context }) => {
  const [apiDocs] = await Promise.all([
    context.waitForEvent('page'),
    page.click('id=restApiButton') // Opens a new tab
  ])
  await apiDocs.waitForLoadState();
  await expect(apiDocs.locator('text=Welcome to api documentation')).toBeVisible();
});