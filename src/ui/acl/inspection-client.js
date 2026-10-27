/**
 * ProofSight — Frontend Anti-Corruption Layer (ACL)
 *
 * Decouples the React UI from internal domain models and backend schemas.
 * Exposes clean, typed DTOs and command methods for the operator.
 */

import { InspectionService } from '../../application/inspection-service.js';
import { StaticKitCatalog } from '../../adapters/kit-catalog.js';
import { OpenCVPerceptionAdapter } from '../../adapters/perception-adapter.js';

export class InspectionClientACL {
  constructor() {
    this.service = new InspectionService(StaticKitCatalog, new OpenCVPerceptionAdapter());
    this.currentSessionId = null;
  }

  async initializeInspection(templateId = 'technician-kit-a104') {
    const session = await this.service.startInspection(templateId);
    this.currentSessionId = session.id;
    return this.mapToUIState(session);
  }

  async captureAndAnalyze(imageInput, imageUri = 'capture.jpg') {
    if (!this.currentSessionId) {
      throw new Error('No active inspection session');
    }
    const session = await this.service.submitCapture(this.currentSessionId, imageInput, imageUri);
    return this.mapToUIState(session);
  }

  async requestFinalVerdict() {
    if (!this.currentSessionId) {
      throw new Error('No active inspection session');
    }
    const verdict = await this.service.evaluateVerdict(this.currentSessionId);
    const session = await this.service.getSession(this.currentSessionId);
    return {
      verdict,
      session: this.mapToUIState(session)
    };
  }

  async submitSupervisorOverride(reviewerId, targetComponentId, reason) {
    if (!this.currentSessionId) {
      throw new Error('No active inspection session');
    }
    const session = await this.service.applyOverride(this.currentSessionId, {
      reviewerId,
      targetComponentId,
      reason
    });
    return this.mapToUIState(session);
  }

  mapToUIState(session) {
    const verifiedCount = session.findings.filter(f => f.status === 'VERIFIED').length;
    const totalCount = session.findings.length;
    const unresolvedCount = session.findings.filter(f => f.status === 'UNRESOLVED').length;

    return {
      id: session.id,
      kitName: session.kitTemplate.name,
      kitVersion: session.kitTemplate.version,
      status: session.status,
      attemptCount: session.attemptCount,
      verifiedCount,
      totalCount,
      unresolvedCount,
      progressRatio: totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0,
      activeGuidance: session.activeGuidance,
      findings: session.findings.map(f => ({
        id: f.componentId,
        name: f.name,
        isMandatory: f.isMandatory,
        status: f.status,
        score: f.evidenceScore,
        reason: f.occlusionReason
      })),
      observations: session.observations.map(o => ({
        id: o.id,
        metrics: o.metrics,
        imageUri: o.imageUri,
        capturedAt: o.capturedAt
      })),
      auditCount: session.auditLog.length
    };
  }
}
