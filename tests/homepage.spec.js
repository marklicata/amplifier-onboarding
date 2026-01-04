// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check title
    await expect(page).toHaveTitle(/Amplifier/);
    
    // Check main heading
    const heading = page.locator('h1');
    await expect(heading).toHaveText('Amplifier');
    
    // Check tagline
    const tagline = page.locator('.tagline');
    await expect(tagline).toHaveText('Program Intelligence, Not Just Code');
  });

  test('should have working navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check all navigation links are present
    await expect(page.locator('.nav-link', { hasText: 'Home' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Playground' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Learn' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'Docs' })).toBeVisible();
    await expect(page.locator('.nav-link', { hasText: 'GitHub' })).toBeVisible();
    
    // Check active state on home page
    await expect(page.locator('.nav-link.active')).toHaveText('Home');
  });

  test('should display all feature cards', async ({ page }) => {
    await page.goto('/');
    
    // Should have exactly 3 feature cards
    const features = page.locator('.feature');
    await expect(features).toHaveCount(3);
    
    // Check feature titles
    await expect(page.locator('.feature-title').nth(0)).toContainText('Experience Pre-Configured Recipes');
    await expect(page.locator('.feature-title').nth(1)).toContainText('Build Custom Solutions');
    await expect(page.locator('.feature-title').nth(2)).toContainText('Share & Discover');
  });

  test('should have CTA button that links to GitHub', async ({ page }) => {
    await page.goto('/');
    
    const cta = page.locator('.cta');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText(/View on GitHub/);
    await expect(cta).toHaveAttribute('href', 'https://github.com/microsoft/amplifier');
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Features should stack vertically (CSS handles this)
    const features = page.locator('.feature');
    await expect(features).toHaveCount(3);
    
    // Logo should still be visible
    await expect(page.locator('.logo')).toBeVisible();
  });

  test('should have skip-to-main link for accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Skip link should exist
    const skipLink = page.locator('.skip-to-main');
    await expect(skipLink).toBeInTheDocument();
    
    // Should be focusable
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
  });
});
