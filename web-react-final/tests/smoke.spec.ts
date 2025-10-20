import { test, expect } from '@playwright/test';

test('homepage renders core sections and hero content', async ({ page }) => {
  // Disable animations for deterministic visibility
  await page.addInitScript(() => {
    try { localStorage.setItem('motionPreference', 'reduce'); } catch {}
  });
  await page.goto('/');

  // Hero section
  await expect(page.locator('#home')).toBeVisible();
  await expect(page.getByRole('heading', { name: /architecting connected experiences/i })).toBeVisible();

  // About section
  await page.locator('#about').scrollIntoViewIfNeeded();
  await expect(page.locator('#about')).toBeVisible();

  // Process section
  await page.locator('#process').scrollIntoViewIfNeeded();
  await expect(page.locator('#process')).toBeVisible();

  // Projects section
  await page.locator('#projects').scrollIntoViewIfNeeded();
  await expect(page.locator('#projects')).toBeVisible();

  // Skills section
  await page.locator('#skills').scrollIntoViewIfNeeded();
  await expect(page.locator('#skills')).toBeVisible();

  // Contact section
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await expect(page.locator('#contact')).toBeVisible();
});
