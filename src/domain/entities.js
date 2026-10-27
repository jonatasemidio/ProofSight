/**
 * ProofSight — Pure Domain Core Entities & State Machines
 *
 * Invariant Guarantee:
 * - ZERO external imports (No framework, DB, or cloud SDKs).
 * - Implements finite state machines defined in docs/ontology.md.
 */

export const ComponentStatuses = {
  NOT_OBSERVED: 'NOT_OBSERVED',
  UNRESOLVED: 'UNRESOLVED',
  SUSPECTED_MISSING: 'SUSPECTED_MISSING',
  VERIFIED: 'VERIFIED',
  CONFIRMED_MISSING: 'CONFIRMED_MISSING',
  ESCALATED: 'ESCALATED'
};

export const SessionStatuses = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  ASSESSING: 'ASSESSING',
  NEEDS_MORE_EVIDENCE: 'NEEDS_MORE_EVIDENCE',
  PASSED: 'PASSED',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED'
};

const VALID_COMPONENT_TRANSITIONS = {
  [ComponentStatuses.NOT_OBSERVED]: [
    ComponentStatuses.UNRESOLVED,
    ComponentStatuses.VERIFIED,
    ComponentStatuses.SUSPECTED_MISSING
  ],
  [ComponentStatuses.UNRESOLVED]: [
    ComponentStatuses.VERIFIED,
    ComponentStatuses.SUSPECTED_MISSING,
    ComponentStatuses.ESCALATED
  ],
  [ComponentStatuses.SUSPECTED_MISSING]: [
    ComponentStatuses.VERIFIED,
    ComponentStatuses.CONFIRMED_MISSING,
    ComponentStatuses.ESCALATED
  ],
  [ComponentStatuses.VERIFIED]: [
    ComponentStatuses.UNRESOLVED // Only allowed if conflicting evidence found
  ],
  [ComponentStatuses.CONFIRMED_MISSING]: [
    ComponentStatuses.VERIFIED // Remediation / supervisor override
  ],
  [ComponentStatuses.ESCALATED]: [
    ComponentStatuses.VERIFIED,
    ComponentStatuses.CONFIRMED_MISSING
  ]
};

export class ComponentFinding {
  constructor(componentId, name, isMandatory = true) {
    this.componentId = componentId;
    this.name = name;
    this.isMandatory = isMandatory;
    this.status = ComponentStatuses.NOT_OBSERVED;
    this.evidenceScore = 0;
    this.supportingObservationId = null;
    this.occlusionReason = null;
    this.history = [];
  }

  transitionTo(nextStatus, evidenceScore = 0, observationId = null, reason = null) {
    const allowed = VALID_COMPONENT_TRANSITIONS[this.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid transition from ${this.status} to ${nextStatus} for component ${this.componentId}`);
    }

    this.history.push({
      fromStatus: this.status,
      toStatus: nextStatus,
      score: this.evidenceScore,
      timestamp: new Date().toISOString()
    });

    this.status = nextStatus;
    this.evidenceScore = evidenceScore;
    if (observationId) this.supportingObservationId = observationId;
    if (reason) this.occlusionReason = reason;
  }
}

export class Observation {
  constructor(id, metrics, imageUri) {
    this.id = id;
    this.metrics = metrics || {}; // blurVariance, exposureMean, homographyScore
    this.imageUri = imageUri;
    this.capturedAt = new Date().toISOString();
  }
}

export class KitTemplate {
  constructor(id, name, version, components = [], referenceImageUri = null) {
    this.id = id;
    this.name = name;
    this.version = version;
    this.components = components;
    this.referenceImageUri = referenceImageUri;
  }
}

export class InspectionSession {
  constructor(id, kitTemplate) {
    if (!kitTemplate || !kitTemplate.id) {
      throw new Error('BR-01: Approved inspection template required');
    }
    this.id = id;
    this.kitTemplate = kitTemplate;
    this.status = SessionStatuses.CREATED;
    this.observations = [];
    this.findings = (kitTemplate.components || []).map(
      c => new ComponentFinding(c.id, c.name, c.isMandatory !== false)
    );
    this.attemptCount = 0;
    this.activeGuidance = null;
    this.override = null;
    this.auditLog = [
      {
        action: 'SESSION_CREATED',
        templateId: kitTemplate.id,
        version: kitTemplate.version,
        timestamp: new Date().toISOString()
      }
    ];
  }

  addObservation(observation) {
    this.observations.push(observation);
    this.attemptCount++;
    this.status = SessionStatuses.ASSESSING;
    this.auditLog.push({
      action: 'OBSERVATION_RECORDED',
      observationId: observation.id,
      attemptNumber: this.attemptCount,
      timestamp: new Date().toISOString()
    });
  }

  findFinding(componentId) {
    return this.findings.find(f => f.componentId === componentId);
  }

  areAllMandatoryVerified() {
    const mandatory = this.findings.filter(f => f.isMandatory);
    return mandatory.every(f => f.status === ComponentStatuses.VERIFIED);
  }

  getUnresolvedFindings() {
    return this.findings.filter(
      f => f.status === ComponentStatuses.UNRESOLVED || f.status === ComponentStatuses.NOT_OBSERVED
    );
  }
}
