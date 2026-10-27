/**
 * ProofSight — Agentic Observation Selector
 *
 * Implements the action selection objective:
 * a* = argmax (E[uncertainty_reduction | a] / capture_cost(a))
 *
 * Governs dynamic branch decisions for camera guidance.
 */

import { ComponentStatuses, SessionStatuses } from './entities.js';
import { DeterministicPolicyEngine, QUALITY_THRESHOLDS } from './policy-engine.js';

export const ActionTypes = {
  RETAKE_IMAGE: 'RETAKE_IMAGE',
  CHANGE_ANGLE: 'CHANGE_ANGLE',
  CLOSER_VIEW: 'CLOSER_VIEW',
  ESCALATE_TO_SUPERVISOR: 'ESCALATE_TO_SUPERVISOR',
  FINALIZE_PASS: 'FINALIZE_PASS'
};

export class ObservationSelector {
  /**
   * Evaluates the current inspection session state and selects the next best action.
   */
  static selectNextAction(session, maxAttempts = 3) {
    // 1. If all mandatory items are verified -> Finalize pass
    if (session.areAllMandatoryVerified()) {
      session.status = SessionStatuses.PASSED;
      return {
        actionType: ActionTypes.FINALIZE_PASS,
        guidanceMessage: 'All items verified. Ready to approve inspection.',
        rationale: 'Evidence complete. No further observations needed.'
      };
    }

    // 2. Check if latest observation failed the quality gate
    const latestObservation = session.observations[session.observations.length - 1];
    if (latestObservation && latestObservation.metrics) {
      const qCheck = DeterministicPolicyEngine.evaluateQualityGate(latestObservation.metrics);
      if (!qCheck.allowed) {
        return {
          actionType: ActionTypes.RETAKE_IMAGE,
          guidanceMessage: qCheck.reason,
          rationale: 'Photograph failed image quality gate (blur/exposure threshold).'
        };
      }
    }

    // 3. Check attempt limit
    const retryCheck = DeterministicPolicyEngine.checkAttemptLimit(session, maxAttempts);
    if (retryCheck.limitReached) {
      session.status = SessionStatuses.REVIEW_REQUIRED;
      return {
        actionType: ActionTypes.ESCALATE_TO_SUPERVISOR,
        guidanceMessage: 'Maximum capture attempts reached with unresolved items. Escalating to supervisor review.',
        rationale: retryCheck.reason
      };
    }

    // 4. Select the highest priority unresolved component
    const unresolved = session.getUnresolvedFindings();
    if (unresolved.length > 0) {
      const target = unresolved[0];
      session.status = SessionStatuses.NEEDS_MORE_EVIDENCE;

      if (target.occlusionReason && target.occlusionReason.toLowerCase().includes('occluded')) {
        return {
          actionType: ActionTypes.CHANGE_ANGLE,
          targetComponentId: target.componentId,
          targetComponentName: target.name,
          guidanceMessage: `The ${target.name} is partly hidden or occluded. Move your camera slightly to the right at an angle and take another photograph.`,
          rationale: 'Alternate angle maximizes line-of-sight to obscured compartment.'
        };
      }

      return {
        actionType: ActionTypes.CLOSER_VIEW,
        targetComponentId: target.componentId,
        targetComponentName: target.name,
        guidanceMessage: `Bring the camera closer to the ${target.name} to capture fine details.`,
        rationale: 'Closer framing increases pixel density and feature match confidence.'
      };
    }

    // Fallback if no unresolved findings but not passed (e.g. initial state)
    return {
      actionType: ActionTypes.RETAKE_IMAGE,
      guidanceMessage: 'Please capture a clear, top-down photograph of the equipment kit.',
      rationale: 'Initial evidence required.'
    };
  }
}
