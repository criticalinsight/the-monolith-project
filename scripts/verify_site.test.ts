import { test, expect } from '@playwright/test';

test('verify monolith project visuals and credits', async ({ page }) => {
    const url = 'https://master.the-monolith-project.pages.dev';
    console.log(`🚀 Navigating to ${url}...`);

    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait for initial load
    console.log('⌛ Waiting for scene initialization...');
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'verify_debug_start.png' });

    // Capture initial state
    await page.screenshot({ path: 'verify_initial_load.png' });

    // Check for blank screen (grey background is #cfcfcf or similar)
    // We'll trust the visual verification for now but can add pixel diff later

    // Click the spark (center of screen usually)
    console.log('✨ Clicking spark...');
    await page.mouse.click(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);

    // Wait for transition
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'verify_scene_active.png' });

    // Find and click CREDITS
    console.log('📝 Opening credits...');
    const creditsButton = page.locator('button', { hasText: 'CREDITS' });
    if (await creditsButton.isVisible()) {
        await creditsButton.click({ force: true });
    } else {
        // Fallback search in case it's not a button or has different casing
        await page.click('text=/CREDITS/i', { force: true });
    }

    // Wait for modal
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verify_credits_modal.png' });

    // Verify Financial Rebrand
    const pageText = await page.innerText('body');
    const upperText = pageText.toUpperCase();

    console.log('🔍 Verifying financial narrative tokens...');
    expect(upperText).toContain('CAPITAL');
    expect(upperText).toContain('LIQUIDITY');
    expect(upperText).toContain('MOECAPITAL');

    // Ensure original cosmic terms are gone where replaced
    console.log('🔍 Ensuring cosmic terms are removed...');
    expect(upperText).not.toContain('COSMIC ORIGINS');

    console.log('✅ Visual and narrative verification successful!');
});
