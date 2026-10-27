import { test, expect } from '@playwright/test';

test.describe('ProofSight Frontline PO Acceptance Simulation (SlowMo 600ms)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('US-01 & US-04 & US-07 & US-10: End-to-end Adaptive Occlusion -> Follow-up -> Final Approval', async ({ page }) => {
    // 1. US-01: Verify Kit Template initialized
    await expect(page.locator('.brand-name')).toHaveText('ProofSight');
    await expect(page.locator('.kit-name')).toContainText('Technician Kit A-104');
    await expect(page.locator('.checklist-ratio')).toContainText('0/8 Verified');

    // Verify real tool kit photo is loaded in the viewfinder
    const photo = page.locator('.captured-image');
    await expect(photo).toBeVisible();

    // 2. US-04: Capture initial photograph with c1 partially occluded (preset default)
    const shutterBtn = page.locator('#shutter-button');
    await expect(shutterBtn).toBeVisible();
    await shutterBtn.click();

    // Wait for analysis
    await page.waitForTimeout(800);
    await expect(page.locator('.checklist-ratio')).toContainText('7/8 Verified');

    // 3. US-07: Verify Agent Guidance issued for Precision Screwdriver (c1)
    const guidance = page.locator('.guidance-card');
    await expect(guidance).toBeVisible();
    await expect(guidance).toContainText('Precision Screwdriver');
    await expect(guidance).toContainText('angle');

    // 4. US-08: Follow-up capture following agent angle guidance
    await expect(shutterBtn).toContainText('Capture Next View');
    await shutterBtn.click();

    // Wait for secondary analysis
    await page.waitForTimeout(800);
    await expect(page.locator('.checklist-ratio')).toContainText('8/8 Verified');
    await expect(page.locator('.btn-authorize')).toBeVisible();

    // 5. US-10: Authorize final verdict
    const evalBtn = page.locator('#evaluate-button');
    await expect(evalBtn).toBeEnabled();
    await evalBtn.click();

    // Verify Certificate Modal
    const modal = page.locator('.modal-dialog');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('PASSED');
    await expect(modal.locator('.cert-hash')).toBeVisible();

    // Dismiss modal
    await modal.locator('button:has-text("Done")').click();
    await expect(modal).not.toBeVisible();
  });

  test('US-05: Image Quality Gate Rejection on Blurry Photograph', async ({ page }) => {
    // Switch preset to blurry photo
    await page.selectOption('.sample-select', 'blurry');
    await page.waitForTimeout(400);

    const shutterBtn = page.locator('#shutter-button');
    await shutterBtn.click();
    await page.waitForTimeout(800);

    // Verify quality gate rejection guidance
    const guidance = page.locator('.guidance-card');
    await expect(guidance).toBeVisible();
    await expect(guidance).toContainText('blurred');
  });

  test('US-11: Supervisor Exception Review and Human Override', async ({ page }) => {
    // Switch preset to missing screwdriver photo
    await page.selectOption('.sample-select', 'missing');
    await page.waitForTimeout(400);

    // Capture photograph
    await page.locator('#shutter-button').click();
    await page.waitForTimeout(800);

    // Click supervisor review link
    const overrideBtn = page.locator('#supervisor-review-btn');
    await expect(overrideBtn).toBeVisible();
    await overrideBtn.click();

    // Confirm override modal
    const overrideModal = page.locator('.modal-dialog');
    await expect(overrideModal).toBeVisible();
    await overrideModal.locator('button:has-text("Confirm Override")').click();

    await page.waitForTimeout(500);
    await expect(page.locator('.checklist-ratio')).toContainText('8/8 Verified');
  });
});
