import { test, expect, Page, APIRequestContext } from '@playwright/test';

test.describe('Critical Workflows & Core Navigation', () => {

  test('Homepage has correct identity and navigation functions', async ({ page }: { page: Page }) => {
    await page.goto('/');

    // Validate SEO Title mapping
    await expect(page).toHaveTitle(/Procurely|Building Materials/i);

    // Validate header links exist
    const navLinks = ['/materials', '/how-it-works'];
    for (const href of navLinks) {
      const link = page.locator(`header a[href="${href}"]`).first();
      await expect(link).toBeVisible();
    }
  });

  test('Mock standard Add to Cart workflow operates flawlessly', async ({ page }: { page: Page }) => {
    // Note: Depends on local API mock or seeded testing environment
    await page.goto('/materials');

    // Assumes there's products rendered. We attempt to grab the first active product.
    const productCard = page.locator('.product-card').first();
    if(await productCard.isVisible()) {
        const title = await productCard.locator('h3').textContent();
        await productCard.locator('button:has-text("Add")').click();
        
        // E2E UI check: Verify cart updates visually
        const cartBadge = page.locator('header button svg').locator('..').locator('span.bg-\\[\\#1D4ED8\\]');
        await expect(cartBadge).toHaveText('1', { timeout: 10000 });
    }
  });

  test('Broken Link Detection on homepage', async ({ page, request }: { page: Page, request: APIRequestContext }) => {
    await page.goto('/');
    
    // Identify all internal links and verify they do not return 404
    const links: string[] = await page.locator('a[href^="/"]').evaluateAll((elements: HTMLAnchorElement[]) =>
      elements.map((el) => el.pathname)
    );

    // Filter duplicates
    const uniqueLinks: string[] = Array.from(new Set(links));

    for (const link of uniqueLinks) {
       // Filter empty/hash
       if (link.length > 1) {
         const response = await request.get(link);
         expect(response.status()).toBeLessThan(400); 
       }
    }
  });

  test('Complete purchase workflow: login -> add to cart -> checkout', async ({ page }: { page: Page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'customer@useprocurely.com');
    await page.fill('input[name="password"]', 'Apassword123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/account/);

    // Go to materials
    await page.goto('/materials');
    // Add to cart
    const productCard = page.locator('.product-card').first();
    if (await productCard.isVisible()) {
      await productCard.locator('button:has-text("Add")').click();
      // Check cart
      const cartBadge = page.locator('header button svg').locator('..').locator('span.bg-\\[\\#1D4ED8\\]');
      await expect(cartBadge).toHaveText('1');
      // Go to cart
      await page.click('header a[href="/cart"]');
      await expect(page).toHaveURL('/cart');
      // Proceed to checkout
      await page.click('button:has-text("Checkout")');
      await expect(page).toHaveURL('/checkout');
    }
  });

  // Additional mock performance assertion logic
  test('Check homepage bundle loading performance criteria', async ({ page }: { page: Page }) => {
    await page.goto('/');
    // Check main document latency
    const timing = await page.evaluate(() => JSON.stringify(window.performance.timing));
    const parsed = JSON.parse(timing);
    
    const loadTime = parsed.loadEventEnd - parsed.navigationStart;
    // Hard check blocking deployment if page load metrics fail drastically (e.g. > 5 seconds in CI)
    test.info().annotations.push({ type: 'performance', description: `Load time: ${loadTime}ms` });
    expect(loadTime).toBeLessThan(7000); 
  });
});
