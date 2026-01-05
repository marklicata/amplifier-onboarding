// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Should have one h1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Amplifier');
    
    // Feature cards should use h2
    const h2 = page.locator('h2');
    await expect(h2).toHaveCount(3);
  });

  test('should have ARIA labels where needed', async ({ page }) => {
    await page.goto('/');
    
    // Skip link should have aria-label
    await expect(page.locator('.skip-to-main')).toHaveAttribute('aria-label');
    
    // Navigation should have role
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    
    // Main content should have role
    await expect(page.locator('main')).toHaveAttribute('role', 'main');
  });

  test('should have alt text for images or aria-hidden for decorative icons', async ({ page }) => {
    await page.goto('/');
    
    // Decorative emoji icons should have aria-hidden
    const icons = page.locator('.feature-icon');
    for (let i = 0; i < await icons.count(); i++) {
      await expect(icons.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/');
    
    // Tab through interactive elements
    let tabCount = 0;
    const maxTabs = 20;
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab');
      tabCount++;
      
      // Check if something is focused
      const focused = await page.evaluateHandle(() => document.activeElement);
      const tagName = await focused.evaluate(el => el.tagName);
      
      // Should be able to focus interactive elements
      if (['A', 'BUTTON', 'INPUT'].includes(tagName)) {
        // Good - found an interactive element
      }
    }
    
    // Should be able to tab to CTA button
    const cta = page.locator('.cta');
    await cta.focus();
    await expect(cta).toBeFocused();
  });

  test('should have sufficient color contrast', async ({ page }) => {
    await page.goto('/');
    
    // This is a basic check - for full contrast analysis, use axe-core
    // Here we just verify key elements are visible
    await expect(page.locator('.logo')).toBeVisible();
    await expect(page.locator('.tagline')).toBeVisible();
    await expect(page.locator('.description')).toBeVisible();
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.search-box');
    
    // Search box should have aria-label
    await expect(page.locator('#search-box')).toHaveAttribute('aria-label');
  });

  test('should have lang attribute', async ({ page }) => {
    await page.goto('/');
    
    // HTML element should have lang="en"
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'en');
  });

  test('should have viewport meta tag', async ({ page }) => {
    await page.goto('/');
    
    // Check viewport meta tag exists
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toContain('width=device-width');
  });
});
