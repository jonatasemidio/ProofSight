import React from 'react';

export default function CertificateModal({ verdict, onClose }) {
  if (!verdict) return null;

  const isPassed = verdict.status === 'PASSED';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="holographic-certificate-card modal-dialog" 
        onClick={e => e.stopPropagation()}
      >
        {/* Certificate Header Banner */}
        <div className={`cert-top-banner ${isPassed ? 'passed' : 'review'}`}>
          <div className="cert-status-pill">
            {isPassed ? 'PASSED — EQUIPMENT RELEASE AUTHORIZED' : 'HELD — SUPERVISOR SIGN-OFF REQUIRED'}
          </div>
          <span className="cert-authority">POLICY ENGINE • BR-09 COMPLIANT</span>
        </div>

        <div className="cert-content">
          <div className="cert-seal-row">
            <div className={`cert-seal ${isPassed ? 'passed' : 'review'}`}>
              {isPassed ? '✓' : '!'}
            </div>
            <div className="cert-meta-headers">
              <h2 className="cert-main-title">
                {isPassed ? 'Official Evidence Verification Certificate' : 'Inspection Exception Hold'}
              </h2>
              <span className="cert-timestamp">{new Date().toLocaleString()}</span>
            </div>
          </div>

          <p className="cert-explanation">{verdict.reason}</p>

          {/* Cryptographic Proof Hash */}
          {verdict.certificateHash && (
            <div className="cert-hash-block">
              <div className="hash-header">
                <span className="hash-label">Cryptographic Evidence Digest (SHA-256)</span>
                <span className="hash-verified-stamp">IMMUTABLE AUDIT LOG</span>
              </div>
              <code className="hash-string cert-hash">{verdict.certificateHash}</code>
              <span className="hash-sub">Tamper-evident hash verified against S3 audit registry</span>
            </div>
          )}

          {verdict.unverifiedItems && verdict.unverifiedItems.length > 0 && (
            <div className="cert-exception-list">
              <span className="exception-label">Unresolved Mandatory Components:</span>
              <div className="exception-chips">
                {verdict.unverifiedItems.map((item, idx) => (
                  <span key={idx} className="exception-chip">{item}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="cert-actions">
          <button 
            type="button" 
            className="btn-cert-primary" 
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
