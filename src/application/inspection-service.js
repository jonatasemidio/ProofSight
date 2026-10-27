/**
 * ProofSight — Inspection Application Service (Inbound Port Implementation)
 *
 * Coordinates domain aggregates, perception adapters, and policy evaluation.
 */

import { InspectionSession, Observation, ComponentStatuses, SessionStatuses } from '../domain/entities.js';
import { DeterministicPolicyEngine } from '../domain/policy-engine.js';
import { ObservationSelector } from '../domain/observation-selector.js';

export class InspectionService {
  constructor(kitCatalog, perceptionAdapter) {
    this.kitCatalog = kitCatalog;
    this.perceptionAdapter = perceptionAdapter;
    this.sessions = new Map();
  }

  async startInspection(templateId) {
    const kit = this.kitCatalog.getKitById(templateId);
    if (!kit) {
      throw new Error(`BR-01: Approved inspection template "${templateId}" not found.`);
    }

    const sessionId = `insp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const session = new InspectionSession(sessionId, kit);
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Inspection session "${sessionId}" not found.`);
    }
    return session;
  }

  async submitCapture(sessionId, imageInput, imageUri = 'capture.jpg') {
    const session = await this.getSession(sessionId);

    // 1. Perception analysis via adapter
    const analysis = this.perceptionAdapter.analyzeImage(imageInput, session.kitTemplate);
    const observationId = `obs-${Date.now().toString(36)}`;
    const observation = new Observation(observationId, analysis.quality, imageUri);
    session.addObservation(observation);

    // 2. Evaluate Quality Gate (BR-06)
    const qualityCheck = DeterministicPolicyEngine.evaluateQualityGate(analysis.quality);
    if (!qualityCheck.allowed) {
      session.activeGuidance = {
        actionType: 'RETAKE_IMAGE',
        guidanceMessage: qualityCheck.reason,
        rationale: 'Photograph failed image quality gate.'
      };
      session.auditLog.push({
        action: 'QUALITY_GATE_REJECTED',
        ruleId: 'BR-06',
        reason: qualityCheck.reason,
        timestamp: new Date().toISOString()
      });
      return session;
    }

    // 3. Update findings based on OpenCV measurements (BR-02, BR-03)
    analysis.componentMeasurements.forEach(m => {
      const finding = session.findFinding(m.componentId);
      if (!finding) return;

      const compReq = session.kitTemplate.components.find(c => c.id === m.componentId);
      const evalResult = DeterministicPolicyEngine.evaluateComponentFinding(compReq, m);

      // If already verified, retain verified
      if (finding.status === ComponentStatuses.VERIFIED) {
        return;
      }

      finding.transitionTo(
        evalResult.status,
        evalResult.score,
        observationId,
        evalResult.reason
      );
    });

    // 4. Select next observation action
    const guidance = ObservationSelector.selectNextAction(session);
    session.activeGuidance = guidance;

    session.auditLog.push({
      action: 'ACTION_GUIDANCE_ISSUED',
      actionType: guidance.actionType,
      targetComponentId: guidance.targetComponentId,
      guidanceMessage: guidance.guidanceMessage,
      timestamp: new Date().toISOString()
    });

    return session;
  }

  async evaluateVerdict(sessionId) {
    const session = await this.getSession(sessionId);
    const verdict = DeterministicPolicyEngine.evaluateSessionVerdict(session);

    session.auditLog.push({
      action: 'FINAL_VERDICT_ISSUED',
      verdictStatus: verdict.status,
      ruleId: verdict.ruleId,
      certificateHash: verdict.certificateHash,
      timestamp: new Date().toISOString()
    });

    return verdict;
  }

  async applyOverride(sessionId, override) {
    const session = await this.getSession(sessionId);
    DeterministicPolicyEngine.applyHumanOverride(session, override);
    return session;
  }
}
