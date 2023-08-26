import { expect, test } from '@playwright/test';

test('Home page loads', async ({ page }) => {
	await page.goto('/');
	expect(page.title).toBe('Quadball');
});
