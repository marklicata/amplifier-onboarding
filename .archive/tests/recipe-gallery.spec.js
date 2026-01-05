// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Recipe Gallery', () => {
  test('should load and display 5 recipes', async ({ page }) => {
    await page.goto('/playground/');
    
    // Wait for recipes to load
    await page.waitForSelector('.recipe-card');
    
    // Should have exactly 5 recipe cards
    const recipes = page.locator('.recipe-card');
    await expect(recipes).toHaveCount(5);
  });

  test('should filter recipes by category', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Click "Code Quality" filter
    await page.locator('[data-category="code-quality"]').click();
    
    // Should show only Code Quality recipes (2 recipes)
    const visibleRecipes = page.locator('.recipe-card');
    await expect(visibleRecipes).toHaveCount(2);
    
    // Filter button should be active
    await expect(page.locator('[data-category="code-quality"]')).toHaveClass(/active/);
  });

  test('should filter recipes by difficulty', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Click "Beginner" filter
    await page.locator('[data-difficulty="beginner"]').click();
    
    // Should show only Beginner recipes (3 recipes)
    const visibleRecipes = page.locator('.recipe-card');
    await expect(visibleRecipes).toHaveCount(3);
  });

  test('should search recipes by name', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Type in search box
    const searchBox = page.locator('#search-box');
    await searchBox.fill('security');
    
    // Wait for debounce (300ms)
    await page.waitForTimeout(400);
    
    // Should show only Security Audit recipe
    const visibleRecipes = page.locator('.recipe-card');
    await expect(visibleRecipes).toHaveCount(1);
    
    // Verify it's the right recipe
    await expect(page.locator('.recipe-title').first()).toContainText('Security Audit');
  });

  test('should show no results message when no recipes match', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Search for something that doesn't exist
    await page.locator('#search-box').fill('nonexistent-recipe');
    await page.waitForTimeout(400);
    
    // No results message should appear
    await expect(page.locator('#no-results')).toBeVisible();
    await expect(page.locator('#no-results')).toContainText('No Recipes Found');
  });

  test('should reset filters', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Apply some filters
    await page.locator('[data-category="security"]').click();
    await page.waitForSelector('.recipe-card'); // Wait for filtering
    
    // Should show 1 recipe
    await expect(page.locator('.recipe-card')).toHaveCount(1);
    
    // Click reset (via no results or programmatically)
    await page.locator('#search-box').fill('xyz');
    await page.waitForTimeout(400);
    await expect(page.locator('#no-results')).toBeVisible();
    
    // Click reset button
    await page.locator('#no-results button').click();
    
    // Should show all 5 recipes again
    await expect(page.locator('.recipe-card')).toHaveCount(5);
  });

  test('should navigate to recipe detail page', async ({ page }) => {
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // Click "View Recipe" on first card
    await page.locator('.btn-recipe').first().click();
    
    // Should navigate to detail page
    await expect(page).toHaveURL(/\/playground\/recipes\//);
    
    // Should have breadcrumb
    await expect(page.locator('.breadcrumb')).toBeVisible();
    
    // Should have recipe detail content
    await expect(page.locator('.recipe-detail-header')).toBeVisible();
  });

  test('should have responsive grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/playground/');
    await page.waitForSelector('.recipe-card');
    
    // All recipes should still be visible
    await expect(page.locator('.recipe-card')).toHaveCount(5);
    
    // Cards should stack (grid-template-columns: 1fr in CSS)
    // Just verify they're visible and readable
    const firstCard = page.locator('.recipe-card').first();
    await expect(firstCard).toBeVisible();
  });
});
