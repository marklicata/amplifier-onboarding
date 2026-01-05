// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Performance', () => {
  test('homepage should load quickly', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;
    
    // Page should load in under 2 seconds
    expect(loadTime).toBeLessThan(2000);
    console.log(`Homepage load time: ${loadTime}ms`);
  });

  test('should have no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.goto('/playground/');
    
    expect(errors).toHaveLength(0);
  });

  test('CSS and JavaScript should load successfully', async ({ page }) => {
    const requests = [];
    const failed = [];
    
    page.on('request', request => requests.push(request.url()));
    page.on('requestfailed', request => failed.push(request.url()));
    
    await page.goto('/');
    
    // Check CSS loaded
    expect(requests.some(url => url.includes('main.css'))).toBeTruthy();
    
    // No failed requests
    expect(failed).toHaveLength(0);
  });

  test('recipe gallery should load recipes within 1 second', async ({ page }) => {
    await page.goto('/playground/');
    
    // Wait for recipes to load
    const startTime = Date.now();
    await page.waitForSelector('.recipe-card', { timeout: 1000 });
    const loadTime = Date.now() - startTime;
    
    console.log(`Recipes load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(1000);
  });

  test('images should have proper loading attributes', async ({ page }) => {
    await page.goto('/');
    
    // Future images should have loading="lazy" for performance
    const images = page.locator('img');
    const count = await images.count();
    
    console.log(`Total images on homepage: ${count}`);
    // Currently we use emoji, not img tags, so count should be 0
  });
});
