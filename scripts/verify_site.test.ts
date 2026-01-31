import { test, expect } from '@playwright/test';

test('verify monolith project visuals and credits', async ({ page }) => {
    const url = 'https://master.the-monolith-project.pages.dev';
    console.log(`🚀 Navigating to ${url}...`);

    await page.goto(url);

    // Wait for initial load
    await page.waitForTimeout(5000);

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

    // Verify MoeCapital
    const pageText = await page.innerText('body');
    console.log('🔍 Checking for "MoeCapital" (case-insensitive)...');
    expect(pageText.toUpperCase()).toContain('MOECAPITAL');

    // Ensure original creator is gone (Kehan Fan)
    console.log('🔍 Ensuring "Kehan Fan" is removed...');
    expect(pageText).not.toContain('Kehan Fan');

    console.log('✅ Visual verification successful!');
});
