// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {
  test('should navigate between pages', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page).toHaveURL('/');
    
    // Navigate to Playground
    await page.locator('.nav-link', { hasText: 'Playground' }).click();
    await expect(page).toHaveURL('/playground/');
    await expect(page.locator('h1')).toContainText('Recipe Playground');
    
    // Navigate to Learn
    await page.locator('.nav-link', { hasText: 'Learn' }).click();
    await expect(page).toHaveURL('/learn/');
    await expect(page.locator('h1')).toContainText('Learning Hub');
    
    // Navigate to Docs
    await page.locator('.nav-link', { hasText: 'Docs' }).click();
    await expect(page).toHaveURL('/docs/');
    await expect(page.locator('h1')).toContainText('Documentation');
    
    // Navigate back to Home
    await page.locator('.nav-link', { hasText: 'Home' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should show active state on current page', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.nav-link.active')).toHaveText('Home');
    
    await page.goto('/playground/');
    await expect(page.locator('.nav-link.active')).toHaveText('Playground');
    
    await page.goto('/learn/');
    await expect(page.locator('.nav-link.active')).toHaveText('Learn');
  });

  test('should be keyboard accessible', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab to focus skip-to-main link
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-to-main')).toBeFocused();
    
    // Press Tab to focus first nav link
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav-logo')).toBeFocused();
    
    // Continue tabbing through nav links
    await page.keyboard.press('Tab');
    await expect(page.locator('.nav-link').first()).toBeFocused();
  });

  test('should have navbar on all pages', async ({ page }) => {
    const pages = ['/', '/playground/', '/learn/', '/docs/'];
    
    for (const url of pages) {
      await page.goto(url);
      await expect(page.locator('.navbar')).toBeVisible();
      await expect(page.locator('.nav-logo')).toHaveText('Amplifier');
    }
  });
});
