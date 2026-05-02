import { test, expect } from '@playwright/test';

test.describe('OrderItemList Component', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming we can view the order PRC-01234
    await page.goto('/account/orders/PRC-01234');
  });

  test('should render order header and item count correctly', async ({ page }) => {
    const header = page.locator('h2', { hasText: 'Order PRC-01234' });
    await expect(header).toBeVisible();
    
    const count = page.locator('span', { hasText: 'Line Items' });
    await expect(count).toContainText('3');
  });

  test('should display all items from the requirement', async ({ page }) => {
    const products = ['Sharp Sand', 'Marine Plywood', 'Reinforcement Steel (Rebars)'];
    for (const product of products) {
      await expect(page.locator('text=' + product)).toBeVisible();
    }
  });

  test('should calculate grand total correctly', async ({ page }) => {
    // 80,000 + 22,000 + 4,900 = 106,900
    const total = page.locator('span', { hasText: 'N106,900' });
    await expect(total).toBeVisible();
  });

  test('should be responsive - switch to card layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Table header should be hidden
    const tableHeader = page.locator('thead');
    await expect(tableHeader).not.toBeVisible();
    
    // Cards should be visible (they have specific padding/flex)
    const cards = page.locator('.md\\:hidden > div');
    const cardCount = await cards.count();
    expect(cardCount).toBe(3);
  });

  test('should have accessible reorder buttons', async ({ page }) => {
    const reorderBtn = page.locator('button[aria-label="Reorder Sharp Sand"]').first();
    await expect(reorderBtn).toBeVisible();
    await expect(reorderBtn).toBeEnabled();
  });
});
