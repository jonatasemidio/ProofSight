import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  InspectionSession, 
  ComponentStatuses 
} from '../../src/domain/entities.js';
import { ObservationSelector } from '../../src/domain/observation-selector.js';

describe('TASK-003: Agentic Observation Selector (Dynamic Action Selection)', () => {
  const sampleKit = {
    id: 'technician-kit-a104',
    name: 'Technician Kit A-104',
    version: '1.0.0',
    components: [
      { id: 'c1', name: 'Precision Screwdriver', quantity: 1, isMandatory: true },
      { id: 'c2', name: 'Hex Key Set', quantity: 1, isMandatory: true }
    ]
  };

  it('selects FINALIZE_PASS when all mandatory items are verified', () => {
    const session = new InspectionSession('session-301', sampleKit);
    session.findFinding('c1').transitionTo(ComponentStatuses.VERIFIED, 95);
    session.findFinding('c2').transitionTo(ComponentStatuses.VERIFIED, 90);

    const guidance = ObservationSelector.selectNextAction(session);
    assert.equal(guidance.actionType, 'FINALIZE_PASS');
    assert.match(guidance.guidanceMessage, /all items verified/i);
  });

  it('selects RETAKE_IMAGE when latest observation failed quality gate', () => {
    const session = new InspectionSession('session-302', sampleKit);
    session.addObservation({
      id: 'obs-bad',
      metrics: { blurVariance: 32.5, exposureMean: 110 }
    });

    const guidance = ObservationSelector.selectNextAction(session);
    assert.equal(guidance.actionType, 'RETAKE_IMAGE');
    assert.match(guidance.guidanceMessage, /blur/i);
  });

  it('selects CHANGE_ANGLE targeting specific component when partially occluded', () => {
    const session = new InspectionSession('session-303', sampleKit);
    session.findFinding('c1').transitionTo(ComponentStatuses.VERIFIED, 95);
    session.findFinding('c2').transitionTo(ComponentStatuses.UNRESOLVED, 40, 'obs-1', 'Partially occluded by cable');

    const guidance = ObservationSelector.selectNextAction(session);
    assert.equal(guidance.actionType, 'CHANGE_ANGLE');
    assert.equal(guidance.targetComponentId, 'c2');
    assert.match(guidance.guidanceMessage, /Hex Key Set/);
    assert.match(guidance.guidanceMessage, /angle/i);
  });

  it('selects ESCALATE_TO_SUPERVISOR when max attempts reached with unresolved items', () => {
    const session = new InspectionSession('session-304', sampleKit);
    session.attemptCount = 3;
    session.findFinding('c1').transitionTo(ComponentStatuses.VERIFIED, 95);
    session.findFinding('c2').transitionTo(ComponentStatuses.UNRESOLVED, 40);

    const guidance = ObservationSelector.selectNextAction(session);
    assert.equal(guidance.actionType, 'ESCALATE_TO_SUPERVISOR');
    assert.match(guidance.guidanceMessage, /supervisor/i);
  });
});
