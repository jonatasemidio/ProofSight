import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  InspectionSession, 
  ComponentFinding, 
  Observation,
  KitTemplate 
} from '../../src/domain/entities.js';

describe('TASK-001: Pure Domain Core Entities & State Machines', () => {
  const sampleKit = {
    id: 'technician-kit-a104',
    name: 'Technician Kit A-104',
    version: '1.0.0',
    components: [
      { id: 'c1', name: 'Precision Screwdriver', quantity: 1, isMandatory: true, expectedRegion: { x: 10, y: 10, width: 50, height: 100 } },
      { id: 'c2', name: 'Hex Key Set', quantity: 1, isMandatory: true, expectedRegion: { x: 70, y: 10, width: 60, height: 80 } },
      { id: 'c3', name: 'Digital Multimeter', quantity: 1, isMandatory: true, expectedRegion: { x: 140, y: 10, width: 100, height: 120 } }
    ]
  };

  it('initializes InspectionSession with CREATED status and component findings', () => {
    const session = new InspectionSession('session-101', sampleKit);
    assert.equal(session.id, 'session-101');
    assert.equal(session.kitTemplate.id, 'technician-kit-a104');
    assert.equal(session.status, 'CREATED');
    assert.equal(session.findings.length, 3);
    assert.equal(session.findings[0].status, 'NOT_OBSERVED');
    assert.equal(session.findings[0].componentId, 'c1');
    assert.equal(session.attemptCount, 0);
    assert.equal(session.auditLog.length, 1);
    assert.equal(session.auditLog[0].action, 'SESSION_CREATED');
  });

  it('enforces valid component state transitions', () => {
    const finding = new ComponentFinding('c1', 'Precision Screwdriver', true);
    assert.equal(finding.status, 'NOT_OBSERVED');

    // NOT_OBSERVED -> UNRESOLVED
    finding.transitionTo('UNRESOLVED', 45, 'obs-1', 'Partially occluded');
    assert.equal(finding.status, 'UNRESOLVED');
    assert.equal(finding.evidenceScore, 45);
    assert.equal(finding.supportingObservationId, 'obs-1');

    // UNRESOLVED -> VERIFIED
    finding.transitionTo('VERIFIED', 92, 'obs-2');
    assert.equal(finding.status, 'VERIFIED');
    assert.equal(finding.evidenceScore, 92);
  });

  it('rejects invalid component state transitions', () => {
    const finding = new ComponentFinding('c1', 'Precision Screwdriver', true);
    finding.transitionTo('VERIFIED', 95, 'obs-1');
    
    // VERIFIED cannot randomly jump to CONFIRMED_MISSING without UNRESOLVED or supervisor
    assert.throws(() => {
      finding.transitionTo('CONFIRMED_MISSING', 0);
    }, /Invalid transition/);
  });

  it('records observations and increments attempt count', () => {
    const session = new InspectionSession('session-102', sampleKit);
    const observation = new Observation('obs-1', { blurVariance: 140, exposureMean: 128 }, 'clear_top_down.jpg');
    session.addObservation(observation);

    assert.equal(session.observations.length, 1);
    assert.equal(session.attemptCount, 1);
    assert.equal(session.status, 'ASSESSING');
    assert.equal(session.auditLog.length, 2);
  });
});
