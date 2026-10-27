import React, { useState } from 'react';

export default function SupervisorModal({ 
  isOpen, 
  onClose, 
  findings, 
  onSubmit 
}) {
  const [targetId, setTargetId] = useState(findings[0]?.id || 'c1');
  const [reason, setReason] = useState('Physical presence confirmed by supervisor');
  const [badgeId, setBadgeId] = useState('SPV-8842');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      reviewerId: badgeId,
      targetComponentId: targetId,
      reason
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="supervisor-modal-card modal-dialog" 
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header-row">
          <div className="supervisor-icon-badge">🛡</div>
          <div>
            <h2 className="supervisor-modal-title">Supervisor Exception Override</h2>
            <span className="supervisor-policy-tag">Governing Rule: BR-10 (Human Control & Auditability)</span>
          </div>
        </div>

        <p className="supervisor-modal-desc">
          Authorizes manual sign-off of an unresolved or missing component. The original OpenCV vision telemetry is preserved permanently in the immutable audit log.
        </p>

        <form onSubmit={handleSubmit} className="supervisor-form">
          <div className="form-field">
            <label className="field-label">Target Tool Component</label>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="field-control-select"
            >
              {findings.map(f => (
                <option key={f.id} value={f.id}>{f.name} ({f.status})</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label className="field-label">Supervisor Officer Badge ID</label>
            <input
              type="text"
              value={badgeId}
              onChange={e => setBadgeId(e.target.value)}
              className="field-control-input"
              required
            />
          </div>

          <div className="form-field">
            <label className="field-label">Audit Justification & Verification Reason</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="field-control-input"
              placeholder="e.g. Physically inspected in secondary drawer"
              required
            />
          </div>

          <div className="form-actions-row">
            <button type="submit" className="btn-confirm-override">
              Confirm Override (BR-10)
            </button>
            <button type="button" className="btn-cancel-modal" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
