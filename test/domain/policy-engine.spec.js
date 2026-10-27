import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { 
  InspectionSession, 
  ComponentFinding, 
  ComponentStatuses,
  SessionStatuses 
} from '../../src/domain/entities.js';
import { DeterministicPolicyEngine } from '../../src/domain/policy-engine.js';

describe('TASK-002: Deterministic Policy Engine (BR-01 through BR-15)', () => {
  const sampleKit = {
    id: 'technician-kit-a104',
    name: 'Technician Kit A-104',
    version: '1.0.0',
    components: [
      { id: 'c1', name: 'Precision Screwdriver', quantity: 1, isMandatory: true },
      { id: 'c2', name: 'Hex Key Set', quantity: 1, isMandatory: true },
      { id: 'c3', name: 'Reference Card', quantity: 1, isMandatory: false }
    ]
  };

  it('BR-06: Quality gate rejects blurry photograph (blurVariance < 100)', () => {
    const measurement = { blurVariance: 45.2, exposureMean: 120 };
    const check = DeterministicPolicyEngine.evaluateQualityGate(measurement);
    assert.equal(check.allowed, false);
    assert.equal(check.ruleId, 'BR-06');
    assert.match(check.reason, /blurred/i);
  });

  it('BR-06: Quality gate approves clear photograph', () => {
    const measurement = { blurVariance: 165.8, exposureMean: 128 };
    const check = DeterministicPolicyEngine.evaluateQualityGate(measurement);
    assert.equal(check.allowed, true);
    assert.equal(check.ruleId, 'BR-06');
  });

  it('BR-03: Unknown is not missing — occluded component becomes UNRESOLVED, not SUSPECTED_MISSING', () => {
    const req = { id: 'c1', name: 'Precision Screwdriver', isMandatory: true };
    const measurement = {
      featureMatches: 12,
      coverageRatio: 0.4,
      isOccluded: true
    };
    const outcome = DeterministicPolicyEngine.evaluateComponentFinding(req, measurement);
    assert.equal(outcome.status, ComponentStatuses.UNRESOLVED);
    assert.equal(outcome.ruleId, 'BR-03');
    assert.notEqual(outcome.status, ComponentStatuses.SUSPECTED_MISSING);
  });

  it('BR-02: Clear match with adequate features becomes VERIFIED', () => {
    const req = { id: 'c1', name: 'Precision Screwdriver', isMandatory: true };
    const measurement = {
      featureMatches: 48,
      coverageRatio: 0.95,
      isOccluded: false
    };
    const outcome = DeterministicPolicyEngine.evaluateComponentFinding(req, measurement);
    assert.equal(outcome.status, ComponentStatuses.VERIFIED);
    assert.equal(outcome.ruleId, 'BR-02');
  });

  it('BR-09: Final verdict cannot pass if mandatory item is UNRESOLVED or SUSPECTED_MISSING', () => {
    const session = new InspectionSession('session-201', sampleKit);
    // Mark c1 as VERIFIED, c2 remains NOT_OBSERVED
    session.findFinding('c1').transitionTo(ComponentStatuses.VERIFIED, 95);
    
    const verdict = DeterministicPolicyEngine.evaluateSessionVerdict(session);
    assert.notEqual(verdict.status, SessionStatuses.PASSED);
    assert.equal(verdict.status, SessionStatuses.REVIEW_REQUIRED);
    assert.equal(verdict.ruleId, 'BR-09');
    assert.equal(verdict.unverifiedMandatoryCount, 1);
  });

  it('BR-09: All mandatory items verified produces PASSED verdict', () => {
    const session = new InspectionSession('session-202', sampleKit);
    session.findFinding('c1').transitionTo(ComponentStatuses.VERIFIED, 95);
    session.findFinding('c2').transitionTo(ComponentStatuses.VERIFIED, 92);
    // c3 is optional (isMandatory: false)
    
    const verdict = DeterministicPolicyEngine.evaluateSessionVerdict(session);
    assert.equal(verdict.status, SessionStatuses.PASSED);
    assert.equal(verdict.ruleId, 'BR-09');
    assert.ok(verdict.certificateHash);
  });

  it('BR-07: Exceeding maximum retries escalates to REVIEW_REQUIRED', () => {
    const session = new InspectionSession('session-203', sampleKit);
    session.attemptCount = 3;
    session.findFinding('c1').transitionTo(ComponentStatuses.UNRESOLVED, 40);

    const retryCheck = DeterministicPolicyEngine.checkAttemptLimit(session, 3);
    assert.equal(retryCheck.limitReached, true);
    assert.equal(retryCheck.ruleId, 'BR-07');
  });

  it('BR-10: Human override records supervisor, reason and preserves finding history', () => {
    const session = new InspectionSession('session-204', sampleKit);
    const finding = session.findFinding('c1');
    finding.transitionTo(ComponentStatuses.UNRESOLVED, 30, 'obs-1');

    const override = {
      reviewerId: 'sup-42',
      reason: 'Physical item confirmed present by supervisor',
      targetComponentId: 'c1'
    };

    DeterministicPolicyEngine.applyHumanOverride(session, override);
    assert.equal(finding.status, ComponentStatuses.VERIFIED);
    assert.ok(session.override);
    assert.equal(session.override.reviewerId, 'sup-42');
    assert.equal(finding.history.length, 2);
    assert.equal(finding.history[0].toStatus, ComponentStatuses.UNRESOLVED);
    assert.equal(finding.history[1].toStatus, ComponentStatuses.VERIFIED);
  });
});
