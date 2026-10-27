import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InspectionService } from '../../src/application/inspection-service.js';
import { StaticKitCatalog } from '../../src/adapters/kit-catalog.js';
import { OpenCVPerceptionAdapter } from '../../src/adapters/perception-adapter.js';
import { ComponentStatuses, SessionStatuses } from '../../src/domain/entities.js';

describe('TASK-004: Inbound Ports & Inspection Application Service', () => {
  it('orchestrates complete happy path inspection flow to PASSED verdict', async () => {
    const service = new InspectionService(StaticKitCatalog, new OpenCVPerceptionAdapter());
    
    // 1. Start inspection
    const session = await service.startInspection('technician-kit-a104');
    assert.equal(session.status, SessionStatuses.CREATED);
    assert.equal(session.findings.length, 8);

    // 2. Submit initial capture with all 8 items clearly visible
    const updated = await service.submitCapture(session.id, {
      blurVariance: 175,
      exposureMean: 130,
      simulatedOcclusions: [],
      simulatedMissing: []
    }, 'top_down_kit_01.jpg');

    assert.equal(updated.attemptCount, 1);
    assert.equal(updated.findings.every(f => f.status === ComponentStatuses.VERIFIED), true);

    // 3. Final verdict
    const verdict = await service.evaluateVerdict(session.id);
    assert.equal(verdict.status, SessionStatuses.PASSED);
    assert.ok(verdict.certificateHash);
  });

  it('orchestrates adaptive follow-up view when an item is occluded', async () => {
    const service = new InspectionService(StaticKitCatalog, new OpenCVPerceptionAdapter());
    const session = await service.startInspection('technician-kit-a104');

    // 1. First capture has c1 occluded
    const s1 = await service.submitCapture(session.id, {
      blurVariance: 160,
      exposureMean: 125,
      simulatedOcclusions: ['c1'] // Screwdriver occluded
    }, 'first_capture.jpg');

    assert.equal(s1.status, SessionStatuses.NEEDS_MORE_EVIDENCE);
    assert.equal(s1.activeGuidance.actionType, 'CHANGE_ANGLE');
    assert.equal(s1.activeGuidance.targetComponentId, 'c1');
    assert.match(s1.activeGuidance.guidanceMessage, /Precision Screwdriver/);

    // 2. Technician follows guidance: submits secondary angled capture resolving c1
    const s2 = await service.submitCapture(session.id, {
      blurVariance: 165,
      exposureMean: 130,
      simulatedOcclusions: [] // Resolved!
    }, 'angled_followup.jpg');

    assert.equal(s2.attemptCount, 2);
    assert.equal(s2.findFinding('c1').status, ComponentStatuses.VERIFIED);
    assert.equal(s2.status, SessionStatuses.PASSED);
  });
});
