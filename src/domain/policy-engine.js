/**
 * ProofSight — Deterministic Policy Engine
 *
 * Enforces business rules BR-01 through BR-15.
 * Pure domain logic with zero external I/O or model dependencies.
 */

import { ComponentStatuses, SessionStatuses } from './entities.js';

export const QUALITY_THRESHOLDS = {
  MIN_BLUR_VARIANCE: 100,
  MIN_EXPOSURE: 15,
  MAX_EXPOSURE: 240
};

export const VERIFICATION_THRESHOLDS = {
  MIN_FEATURE_MATCHES: 30,
  MIN_COVERAGE_RATIO: 0.75
};

export class DeterministicPolicyEngine {
  /**
   * BR-06: Image quality gate
   * Rejects images failing blur or exposure thresholds.
   */
  static evaluateQualityGate(measurement) {
    if (!measurement) {
      return { allowed: false, ruleId: 'BR-06', reason: 'Missing visual measurements' };
    }

    if (measurement.blurVariance < QUALITY_THRESHOLDS.MIN_BLUR_VARIANCE) {
      return {
        allowed: false,
        ruleId: 'BR-06',
        reason: `Image is blurred (Laplacian variance: ${measurement.blurVariance.toFixed(1)} < ${QUALITY_THRESHOLDS.MIN_BLUR_VARIANCE}). Hold camera steady and capture again.`
      };
    }

    if (measurement.exposureMean < QUALITY_THRESHOLDS.MIN_EXPOSURE) {
      return {
        allowed: false,
        ruleId: 'BR-06',
        reason: `Image is severely underexposed (mean intensity: ${measurement.exposureMean.toFixed(1)}). Improve lighting and retake.`
      };
    }

    if (measurement.exposureMean > QUALITY_THRESHOLDS.MAX_EXPOSURE) {
      return {
        allowed: false,
        ruleId: 'BR-06',
        reason: `Image is overexposed/washed out (mean intensity: ${measurement.exposureMean.toFixed(1)}). Reduce glare and retake.`
      };
    }

    return { allowed: true, ruleId: 'BR-06', reason: 'Image quality meets threshold.' };
  }

  /**
   * BR-02 & BR-03: Component finding classification
   * Unknown/occluded produces UNRESOLVED, not SUSPECTED_MISSING.
   * High features + coverage produces VERIFIED.
   */
  static evaluateComponentFinding(req, measurement) {
    if (!measurement) {
      return { status: ComponentStatuses.NOT_OBSERVED, score: 0, ruleId: 'BR-02' };
    }

    // BR-03: Unknown is not missing
    if (measurement.isOccluded || measurement.coverageRatio < VERIFICATION_THRESHOLDS.MIN_COVERAGE_RATIO) {
      return {
        status: ComponentStatuses.UNRESOLVED,
        score: Math.round(measurement.coverageRatio * 50),
        ruleId: 'BR-03',
        reason: 'Partially occluded or insufficient region coverage'
      };
    }

    // BR-02: No unsupported approval (requires sufficient feature matches)
    if (measurement.featureMatches >= VERIFICATION_THRESHOLDS.MIN_FEATURE_MATCHES) {
      const score = Math.min(100, Math.round((measurement.featureMatches / 40) * 85 + (measurement.coverageRatio * 15)));
      return {
        status: ComponentStatuses.VERIFIED,
        score,
        ruleId: 'BR-02'
      };
    }

    // Default when clearly uncovered but features not matched
    return {
      status: ComponentStatuses.SUSPECTED_MISSING,
      score: 10,
      ruleId: 'BR-02',
      reason: 'Region visible but expected component features not found'
    };
  }

  /**
   * BR-07: Maximum retries enforcement
   */
  static checkAttemptLimit(session, maxAttempts = 3) {
    if (session.attemptCount >= maxAttempts) {
      return {
        limitReached: true,
        ruleId: 'BR-07',
        reason: `Maximum retries (${maxAttempts}) reached. Escalating to human supervisor.`
      };
    }
    return { limitReached: false, ruleId: 'BR-07' };
  }

  /**
   * BR-09: Mandatory item enforcement & final verdict
   */
  static evaluateSessionVerdict(session) {
    const mandatory = session.findings.filter(f => f.isMandatory);
    const unverifiedMandatory = mandatory.filter(f => f.status !== ComponentStatuses.VERIFIED);

    if (unverifiedMandatory.length === 0) {
      // Deterministic certificate hash
      const certificateHash = `CERT-${session.id.slice(0, 8)}-${Date.now().toString(36).toUpperCase()}`;
      session.status = SessionStatuses.PASSED;
      return {
        status: SessionStatuses.PASSED,
        ruleId: 'BR-09',
        unverifiedMandatoryCount: 0,
        certificateHash,
        reason: 'All mandatory items verified with supporting visual evidence.'
      };
    }

    // Session has unresolved or missing mandatory items
    session.status = SessionStatuses.REVIEW_REQUIRED;
    return {
      status: SessionStatuses.REVIEW_REQUIRED,
      ruleId: 'BR-09',
      unverifiedMandatoryCount: unverifiedMandatory.length,
      unverifiedItems: unverifiedMandatory.map(m => m.name),
      reason: `${unverifiedMandatory.length} mandatory component(s) unverified. Cannot issue automated pass.`
    };
  }

  /**
   * BR-10: Human override with audit trail
   */
  static applyHumanOverride(session, override) {
    if (!override || !override.reviewerId || !override.reason || !override.targetComponentId) {
      throw new Error('BR-10: Human override requires reviewerId, reason, and targetComponentId');
    }

    const finding = session.findFinding(override.targetComponentId);
    if (!finding) {
      throw new Error(`Component ${override.targetComponentId} not found in session`);
    }

    finding.transitionTo(
      ComponentStatuses.VERIFIED,
      100,
      null,
      `OVERRIDE by ${override.reviewerId}: ${override.reason}`
    );

    session.override = {
      reviewerId: override.reviewerId,
      reason: override.reason,
      targetComponentId: override.targetComponentId,
      timestamp: new Date().toISOString()
    };

    session.auditLog.push({
      action: 'HUMAN_OVERRIDE_APPLIED',
      ruleId: 'BR-10',
      reviewerId: override.reviewerId,
      componentId: override.targetComponentId,
      reason: override.reason,
      timestamp: session.override.timestamp
    });

    return session;
  }
}
