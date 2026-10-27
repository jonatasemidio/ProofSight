import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const OUTPUT_VIDEO_DIR = path.resolve('public/video');
if (!fs.existsSync(OUTPUT_VIDEO_DIR)) {
  fs.mkdirSync(OUTPUT_VIDEO_DIR, { recursive: true });
}

// Clean previous webm files in directory before recording
const existingWebms = fs.readdirSync(OUTPUT_VIDEO_DIR).filter(f => f.endsWith('.webm'));
existingWebms.forEach(f => {
  try { fs.unlinkSync(path.join(OUTPUT_VIDEO_DIR, f)); } catch (e) {}
});

async function recordDemo() {
  console.log('🎬 Starting ProofSight YouTube Demo Recorder (SlowMo + Visual HUD + Cursor)...');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: {
      dir: OUTPUT_VIDEO_DIR,
      size: { width: 1440, height: 900 },
    },
  });

  const page = await context.newPage();

  // Inject Virtual Cursor and Narrative HUD into the page
  await page.addInitScript(() => {
    window.addEventListener('DOMContentLoaded', () => {
      // 1. Inject Virtual Cursor
      const cursor = document.createElement('div');
      cursor.id = 'proofsight-virtual-cursor';
      cursor.innerHTML = `
        <div style="position: relative; width: 36px; height: 36px; pointer-events: none;">
          <svg viewBox="0 0 32 32" width="32" height="32" style="filter: drop-shadow(0 2px 8px rgba(0,240,255,0.8));">
            <path d="M4 2 L28 16 L16 18 L10 28 Z" fill="#00f0ff" stroke="#030712" stroke-width="2" stroke-linejoin="round" />
          </svg>
          <div id="proofsight-cursor-pulse" style="position: absolute; top: 0; left: 0; width: 16px; height: 16px; background: rgba(0, 240, 255, 0.4); border-radius: 50%; border: 2px solid #00f0ff; transform: scale(1); opacity: 0; transition: transform 0.4s ease-out, opacity 0.4s ease-out;"></div>
        </div>
      `;
      cursor.style.position = 'fixed';
      cursor.style.top = '100px';
      cursor.style.left = '100px';
      cursor.style.zIndex = '999999';
      cursor.style.pointerEvents = 'none';
      cursor.style.transition = 'top 0.7s cubic-bezier(0.25, 1, 0.5, 1), left 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(cursor);

      // 2. Inject Narrative HUD Banner at Top-Center
      const hud = document.createElement('div');
      hud.id = 'proofsight-demo-hud';
      hud.style.position = 'fixed';
      hud.style.top = '16px';
      hud.style.left = '50%';
      hud.style.transform = 'translateX(-50%)';
      hud.style.width = '780px';
      hud.style.maxWidth = '92vw';
      hud.style.zIndex = '999998';
      hud.style.background = 'rgba(8, 14, 26, 0.94)';
      hud.style.border = '1px solid rgba(0, 240, 255, 0.45)';
      hud.style.borderRadius = '12px';
      hud.style.padding = '12px 20px';
      hud.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.85), 0 0 20px rgba(0, 240, 255, 0.2)';
      hud.style.backdropFilter = 'blur(16px)';
      hud.style.fontFamily = 'Inter, system-ui, sans-serif';
      hud.style.color = '#ffffff';
      hud.style.transition = 'all 0.4s ease';
      hud.style.pointerEvents = 'none';

      hud.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span id="hud-badge" style="background: rgba(0, 240, 255, 0.15); border: 1px solid #00f0ff; color: #00f0ff; font-family: monospace; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;">SYSTEM READY</span>
            <span id="hud-title" style="font-size: 14px; font-weight: 700; color: #f8fafc; letter-spacing: -0.01em;">ProofSight Autonomous Visual Evidence Agent</span>
          </div>
          <span style="font-size: 11px; color: #94a3b8; font-family: monospace;">E2E DEMO</span>
        </div>
        <div id="hud-desc" style="font-size: 13px; color: #cbd5e1; line-height: 1.4; margin-bottom: 6px;">
          Initializing dual-station inspection cockpit. Loading 8-tool technician kit manifest.
        </div>
        <div id="hud-result-box" style="display: flex; align-items: center; gap: 6px; background: rgba(15, 23, 42, 0.7); border-radius: 6px; padding: 4px 10px; border-left: 3px solid #00f0ff;">
          <span style="color: #00f0ff; font-weight: 700; font-size: 11px; text-transform: uppercase;">EXPECTED RESULT:</span>
          <span id="hud-result" style="font-size: 12px; color: #e2e8f0; font-weight: 500;">Cockpit online with live spatial AR and tool twin telemetry.</span>
        </div>
      `;
      document.body.appendChild(hud);

      // Global helpers
      window.__setHUD = (badge, title, desc, result, color = '#00f0ff') => {
        const hud = document.getElementById('proofsight-demo-hud');
        if (!hud) return;
        document.getElementById('hud-badge').innerText = badge;
        document.getElementById('hud-badge').style.borderColor = color;
        document.getElementById('hud-badge').style.color = color;
        document.getElementById('hud-badge').style.background = `${color}20`;
        document.getElementById('hud-title').innerText = title;
        document.getElementById('hud-desc').innerText = desc;
        document.getElementById('hud-result').innerText = result;
        document.getElementById('hud-result-box').style.borderLeftColor = color;
      };

      window.__moveCursorTo = (x, y) => {
        const cursor = document.getElementById('proofsight-virtual-cursor');
        if (cursor) {
          cursor.style.left = `${x - 4}px`;
          cursor.style.top = `${y - 2}px`;
        }
      };

      window.__clickCursorAt = (x, y) => {
        window.__moveCursorTo(x, y);
        const pulse = document.getElementById('proofsight-cursor-pulse');
        if (pulse) {
          pulse.style.transform = 'scale(3)';
          pulse.style.opacity = '1';
          setTimeout(() => {
            pulse.style.transform = 'scale(4)';
            pulse.style.opacity = '0';
          }, 350);
        }
      };

      window.__highlightDomNode = (el) => {
        document.querySelectorAll('.proofsight-highlight').forEach(e => {
          e.classList.remove('proofsight-highlight');
          e.style.outline = '';
          e.style.boxShadow = '';
        });
        if (el) {
          el.classList.add('proofsight-highlight');
          el.style.outline = '3px solid #00f0ff';
          el.style.boxShadow = '0 0 25px rgba(0, 240, 255, 0.75), inset 0 0 15px rgba(0, 240, 255, 0.2)';
          el.style.transition = 'all 0.3s ease';
        }
      };

      window.__clearHighlight = () => {
        document.querySelectorAll('.proofsight-highlight').forEach(e => {
          e.classList.remove('proofsight-highlight');
          e.style.outline = '';
          e.style.boxShadow = '';
        });
      };
    });
  });

  await page.goto('http://localhost:5173');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Safe point & click helper
  async function pointAndClick(selector, pauseBeforeClick = 1200, pauseAfterClick = 1500) {
    try {
      const loc = page.locator(selector).first();
      await loc.waitFor({ state: 'visible', timeout: 5000 });
      const box = await loc.boundingBox();
      if (!box) return;
      const targetX = box.x + box.width / 2;
      const targetY = box.y + box.height / 2;

      await loc.evaluate((el) => window.__highlightDomNode(el));
      await page.evaluate(({ x, y }) => window.__moveCursorTo(x, y), { x: targetX, y: targetY });
      await page.waitForTimeout(pauseBeforeClick);

      await page.evaluate(({ x, y }) => window.__clickCursorAt(x, y), { x: targetX, y: targetY });
      await loc.click();
      await page.evaluate(() => window.__clearHighlight());
      await page.waitForTimeout(pauseAfterClick);
    } catch (e) {
      console.warn(`Click failed for ${selector}:`, e.message);
    }
  }

  // -------------------------------------------------------------
  // SCENE 1: SYSTEM OVERVIEW (5 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 1: System Overview');
  await page.evaluate(() => {
    window.__setHUD(
      'STEP 1 / 5',
      'Autonomous Dual-Station Cockpit',
      'Technician Kit A-104 loaded into perception bay. 8 critical tools required before dispatch.',
      'Initial state: 0/8 tools verified. 3D Inclinometer artificial horizon active.',
      '#00f0ff'
    );
  });
  await page.evaluate(() => window.__moveCursorTo(1120, 260));
  await page.waitForTimeout(1400);
  await page.evaluate(() => window.__moveCursorTo(1120, 420));
  await page.waitForTimeout(1400);

  // -------------------------------------------------------------
  // SCENE 2: OVERHEAD CAPTURE & OCCLUSION DISCOVERY (7 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 2: Initial Overhead Capture');
  await page.evaluate(() => {
    window.__setHUD(
      'STEP 2 / 5',
      'Initial Overhead Scan — Occlusion Discovery',
      'Operator clicks the Tactical Shutter to trigger multi-modal visual inspection.',
      '7 of 8 tools verified. Precision Screwdriver (c1) flagged as OCCLUDED (Unknown vs Missing).',
      '#38bdf8'
    );
  });
  await page.waitForTimeout(1200);
  await pointAndClick('#shutter-button', 1400, 2200);

  // -------------------------------------------------------------
  // SCENE 3: ACTIVE SPATIAL AR GUIDANCE & INCLINOMETER (8 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 3: Active Spatial AR Guidance');
  await page.evaluate(() => {
    window.__setHUD(
      'STEP 3 / 5',
      'Active Spatial Guidance & Angle Inclinometer',
      'Agent computes line-of-sight obstruction and projects recommended camera tilt angles.',
      'HUD prompts: "Tilt pitch +18° upward to see past the foam bezel and verify screwdriver".',
      '#f59e0b'
    );
  });
  try {
    const card = page.locator('.guidance-card').first();
    if (await card.isVisible()) {
      const box = await card.boundingBox();
      if (box) {
        await page.evaluate(({ x, y }) => window.__moveCursorTo(x, y), {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
        });
        await card.evaluate((el) => window.__highlightDomNode(el));
        await page.waitForTimeout(2500);
        await page.evaluate(() => window.__clearHighlight());
      }
    }
  } catch (e) {}

  // Move cursor to artificial horizon
  try {
    const gyro = page.locator('.inclinometer-gyro-assembly, .inclinometer-hud-overlay').first();
    if (await gyro.isVisible()) {
      const box = await gyro.boundingBox();
      if (box) {
        await page.evaluate(({ x, y }) => window.__moveCursorTo(x, y), {
          x: box.x + box.width / 2,
          y: box.y + box.height / 2,
        });
        await page.waitForTimeout(2000);
      }
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // SCENE 4: ADAPTIVE FOLLOW-UP CAPTURE & CONSENSUS FUSION (8 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 4: Follow-up Capture & Consensus Fusion');
  await page.evaluate(() => {
    window.__setHUD(
      'STEP 4 / 5',
      'Adaptive Follow-Up Capture — Line of Sight Cleared',
      'Operator re-angles camera to +18° tilt and captures secondary viewpoint.',
      'Multi-view fusion confirms tool presence. 8/8 Tools Verified! Release authorized.',
      '#10b981'
    );
  });
  await page.waitForTimeout(1200);
  await pointAndClick('#shutter-button', 1400, 2500);

  // -------------------------------------------------------------
  // SCENE 5: CRYPTOGRAPHIC AIRWORTHINESS RELEASE (9 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 5: Cryptographic Release Authorization');
  await page.evaluate(() => {
    window.__setHUD(
      'STEP 5 / 5',
      'Cryptographic Equipment Release Authorization',
      'Deterministic policy engine issues tamper-evident SHA-256 Airworthiness Release Certificate.',
      'Release certificate generated with cryptographic hash, timestamp, and audit trail.',
      '#10b981'
    );
  });
  await page.waitForTimeout(1200);
  await pointAndClick('#evaluate-button', 1400, 3000);

  // Dismiss certificate modal cleanly
  console.log('▶️ Dismissing Certificate Modal');
  await pointAndClick('.btn-cert-primary', 1000, 1500);

  // -------------------------------------------------------------
  // SCENE 6: OPTICAL QUALITY GATE REJECTION (8 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 6: Optical Quality Gate (Blur Rejection)');
  await page.evaluate(() => {
    window.__setHUD(
      'QUALITY GATE',
      'OpenCV Blur Variance Rejection Gate',
      'Technician attempts to submit a degraded, out-of-focus capture.',
      'OpenCV Laplacian variance < 100 threshold triggers immediate rejection. Prevents false passes.',
      '#ef4444'
    );
  });
  await page.waitForTimeout(1000);
  try {
    await page.selectOption('.sample-select', 'blurry');
    await page.waitForTimeout(800);
    await pointAndClick('#shutter-button', 1200, 2500);
  } catch (e) {}

  // -------------------------------------------------------------
  // SCENE 7: SUMMARY & CONCLUSION (4 seconds)
  // -------------------------------------------------------------
  console.log('▶️ Scene 7: Outro');
  await page.evaluate(() => {
    window.__setHUD(
      'COMPLETE',
      'ProofSight — Zero False Rejections Guaranteed',
      'Active visual guidance turns ambiguous field inspections into verifiable, auditable truth.',
      'Full source available at github.com/jonatasemidio/ProofSight',
      '#00f0ff'
    );
  });
  await page.waitForTimeout(3500);

  await page.close();
  await context.close();
  await browser.close();

  console.log('✅ Browser recording closed. Locating recorded WebM file...');

  const videoFiles = fs.readdirSync(OUTPUT_VIDEO_DIR).filter(f => f.endsWith('.webm'));
  if (videoFiles.length === 0) {
    throw new Error('No .webm file was found in ' + OUTPUT_VIDEO_DIR);
  }

  const latestWebm = path.join(OUTPUT_VIDEO_DIR, videoFiles[videoFiles.length - 1]);
  const finalMp4 = path.join(OUTPUT_VIDEO_DIR, 'proofsight-demo-walkthrough.mp4');
  const audioTrack = path.join(OUTPUT_VIDEO_DIR, 'ambient_tech_track.mp3');

  console.log(`🎬 Converting ${latestWebm} to MP4 with royalty-free soundtrack...`);

  const ffmpegCmd = `ffmpeg -y -i "${latestWebm}" -i "${audioTrack}" -filter_complex "[1:a]afade=t=out:st=48:d=3,volume=0.35[a]" -map 0:v -map "[a]" -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${finalMp4}"`;

  execSync(ffmpegCmd, { stdio: 'inherit' });

  console.log(`🎉 SUCCESS! Final demo video produced: ${finalMp4}`);
}

recordDemo().catch(err => {
  console.error('❌ Error recording demo video:', err);
  process.exit(1);
});
