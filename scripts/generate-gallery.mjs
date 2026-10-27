import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const OUTPUT_DIR = path.resolve('public/gallery');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureGallery() {
  console.log('🚀 Launching browser for 3:2 Gallery Captures (2250x1500 @ 1.5x)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1500, height: 1000 },
    deviceScaleFactor: 1.5,
  });

  const page = await context.newPage();
  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // 1. Cockpit Overview (Ready State)
  console.log('📸 01/10: Cockpit Overview');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_cockpit_overview.png') });

  // 2. Initial Scan Triggered (Occlusion Detected)
  console.log('📸 02/10: Scan Triggered & Occlusion Detected');
  await page.locator('#shutter-button').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_occlusion_detected.png') });

  // 3. Spatial AR Guidance & 3D Inclinometer
  console.log('📸 03/10: Angle Guidance Inclinometer HUD');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_spatial_ar_inclinometer.png') });

  // 4. Secondary Scan Captured (8/8 Verified)
  console.log('📸 04/10: Follow-up Multi-View Capture (8/8 Verified)');
  await page.locator('#shutter-button').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_verified_8_of_8_complete.png') });

  // 5. Cryptographic Release Certificate Modal
  console.log('📸 05/10: Cryptographic Airworthiness Certificate');
  await page.locator('#evaluate-button').click();
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '05_cryptographic_release_certificate.png') });

  // Dismiss modal
  await page.locator('.btn-cert-primary, .modal-dialog button').first().click();
  await page.waitForTimeout(500);

  // 6. Optical Quality Gate Rejection (Blur Detection)
  console.log('📸 06/10: Optical Quality Gate Blur Rejection');
  await page.selectOption('.sample-select', 'blurry');
  await page.waitForTimeout(500);
  await page.locator('#shutter-button').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '06_optical_quality_gate_rejection.png') });

  // 7. Missing Tool Alert
  console.log('📸 07/10: Missing Tool Alert Detection');
  await page.selectOption('.sample-select', 'missing');
  await page.waitForTimeout(500);
  await page.locator('#shutter-button').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '07_missing_tool_alert.png') });

  // 8. Supervisor Exception Review Terminal Modal
  console.log('📸 08/10: Supervisor Exception Review Terminal');
  const supervisorBtn = page.locator('#supervisor-review-btn');
  if (await supervisorBtn.isVisible()) {
    await supervisorBtn.click();
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_supervisor_terminal_modal.png') });
    // Dismiss override modal
    await page.locator('.modal-dialog button:has-text("Cancel"), .btn-cert-secondary').first().click();
    await page.waitForTimeout(500);
  }

  // 9. Reset to Standard Complete View
  console.log('📸 09/10: Complete Release Ready Cockpit');
  await page.selectOption('.sample-select', 'complete');
  await page.waitForTimeout(500);
  await page.locator('#shutter-button').click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '09_complete_release_ready.png') });

  // 10. Digital Twin Manifest Telemetry
  console.log('📸 10/10: Digital Twin Tool Deck View');
  await page.evaluate(() => {
    window.scrollTo({ top: 300, behavior: 'instant' });
  });
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(OUTPUT_DIR, '10_digital_twin_telemetry.png') });

  await browser.close();
  console.log('✅ All 10 gallery images captured with exact 3:2 ratio in public/gallery/');
}

captureGallery().catch(err => {
  console.error('❌ Error generating gallery:', err);
  process.exit(1);
});
