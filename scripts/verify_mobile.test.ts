import { test, expect, devices } from '@playwright/test';

test.use({
    ...devices['iPhone 13'],
});

test('verify monolith project mobile responsive visuals', async ({ page }) => {
    const url = 'https://master.the-monolith-project.pages.dev';
    page.on('console', msg => console.log(`BROWSER [${msg.type()}]: ${msg.text()}`));
    page.on('pageerror', err => console.log(`BROWSER ERROR: ${err.message}`));

    console.log(`🚀 [Mobile] Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    console.log('⌛ [Mobile] Waiting for application mount...');
    await page.waitForSelector('#app', { timeout: 30000 });

    console.log('⌛ [Mobile] Waiting for 3D textures/models...');
    await page.waitForTimeout(15000); // Wait for the "10" spark to appear

    await page.screenshot({ path: 'verify_mobile_load_debug.png' });

    // Click center to start (The Spark)
    console.log('✨ [Mobile] Clicking center...');
    await page.mouse.click(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);

    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'verify_mobile_post_click.png' });

    // Capture text
    const text = await page.evaluate(() => document.body.innerText);
    console.log('📄 [Mobile] Captured Text:', text);

    console.log('✅ Mobile verification pass finished.');
});
