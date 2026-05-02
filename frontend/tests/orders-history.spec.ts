import { test, expect } from '@playwright/test';

test.describe('Orders History Table Responsiveness', () => {
  test.beforeEach(async ({ page }) => {
    // Assuming the component is rendered on the account dashboard page
    await page.goto('/account'); 
  });

  test('should display all columns on desktop without horizontal scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    const tableSection = page.locator('#orders-history-section');
    await expect(tableSection).toBeVisible();

    // Check if the table wrapper has horizontal scroll
    const scrollWidth = await tableSection.evaluate((el) => {
      const wrapper = el.querySelector('.orders-table-wrapper');
      return wrapper ? wrapper.scrollWidth : 0;
    });
    const clientWidth = await tableSection.evaluate((el) => {
      const wrapper = el.querySelector('.orders-table-wrapper');
      return wrapper ? wrapper.clientWidth : 0;
    });

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for subpixel rounding
    
    // Verify all columns are visible
    await expect(page.locator('.col-order-id')).toBeVisible();
    await expect(page.locator('.col-supplier')).toBeVisible();
    await expect(page.locator('.col-amount')).toBeVisible();
    await expect(page.locator('.col-date')).toBeVisible();
    await expect(page.locator('.col-status')).toBeVisible();
    await expect(page.locator('.col-actions')).toBeVisible();
  });

  test('should switch to card layout on mobile and maintain visibility', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const tableSection = page.locator('#orders-history-section');
    await expect(tableSection).toBeVisible();

    // In mobile layout, the header is hidden
    const header = page.locator('.orders-table-header');
    await expect(header).not.toBeVisible();

    // Each row should be visible as a card
    const firstRow = page.locator('.orders-table-row').first();
    await expect(firstRow).toBeVisible();

    // Check if labels are present in mobile view (via CSS content)
    const labelVisible = await firstRow.locator('.col-order-id').evaluate((el) => {
      return window.getComputedStyle(el, '::before').content !== 'none';
    });
    expect(labelVisible).toBeTruthy();

    // Ensure no horizontal scroll on mobile either
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const clientWidth = await page.evaluate(() => document.body.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('should fix data integrity issues (no duplicate amounts)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Look for the Traxus Industrial row which had duplicate amounts
    const traxusRow = page.locator('.orders-table-row', { hasText: 'Traxus Industrial' });
    const amounts = traxusRow.locator('.col-amount .secondary-text');
    
    // In our fix, we only show secondary amount if different. 
    // For Traxus, it was duplicate, so it should NOT have a secondary-text
    await expect(amounts).not.toBeVisible();
  });

  test('should show correct dates (fix invalid date)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    
    const dateCells = page.locator('.col-date .primary-text');
    const firstDateText = await dateCells.first().textContent();
    
    expect(firstDateText).not.toBe('Invalid Date');
    expect(firstDateText).toMatch(/^[A-Z][a-z]{2}\s\d{1,2},\s\d{4}$/); // Matches "Mar 1, 2024"
  });
});
