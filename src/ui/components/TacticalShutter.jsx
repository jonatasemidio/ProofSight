import React from 'react';

export default function TacticalShutter({ 
  verifiedCount, 
  totalCount, 
  isComplete, 
  isCapturing, 
  onClick, 
  onAuthorize,
  attemptCount = 0,
  hasGuidance = false
}) {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = totalCount > 0 ? verifiedCount / totalCount : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Determine button label text (maintains Playwright requirement: "Capture Next View" on follow-up)
  const isFollowUp = attemptCount > 0 && hasGuidance && !isComplete;
  let buttonLabel = 'INITIALIZE SCAN';
  if (isCapturing) buttonLabel = 'ACQUIRING HOMOGRAPHY...';
  else if (isFollowUp) buttonLabel = 'Capture Next View';
  else if (isComplete) buttonLabel = 'RELEASE CRITERIA MET';

  return (
    <footer className="tactical-command-dock" role="toolbar" aria-label="Mission Controls">
      <div className="dock-glass-chassis">
        {/* Left Telemetry Meter */}
        <div className="dock-telemetry-cluster">
          <span className="telemetry-micro-label">SYSTEM READINESS</span>
          <div className="telemetry-bar-readout">
            <span className="readout-ratio">{verifiedCount} / {totalCount}</span>
            <span className="readout-caption">PARTS VERIFIED</span>
          </div>
        </div>

        {/* Centerpiece Tactical Mechanical Shutter */}
        <div className="dock-shutter-station">
          <button
            id="shutter-button"
            type="button"
            className={`knurled-titanium-shutter ${isComplete ? 'complete' : ''} ${isCapturing ? 'capturing' : ''} ${isFollowUp ? 'follow-up' : ''}`}
            onClick={onClick}
            disabled={isCapturing}
            aria-label={buttonLabel}
          >
            {/* Progress Circular HUD Track */}
            <svg className="shutter-radial-svg" width="96" height="96" viewBox="0 0 96 96">
              <circle
                className="radial-track"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="4"
                fill="transparent"
                r={radius}
                cx="48"
                cy="48"
              />
              <circle
                className="radial-indicator"
                stroke={isComplete ? '#00ff88' : isFollowUp ? '#ffaa00' : '#00f0ff'}
                strokeWidth="4"
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx="48"
                cy="48"
              />
            </svg>

            {/* Inner Mechanical Aperture Iris */}
            <div className="shutter-iris-core">
              {isCapturing ? (
                <div className="iris-scanning-rotor" />
              ) : isComplete ? (
                <div className="iris-icon-pass">✓</div>
              ) : isFollowUp ? (
                <div className="iris-icon-angle">⇗</div>
              ) : (
                <div className="iris-aperture-reticle" />
              )}
            </div>

            {/* Visible Text for Ergonomics & Playwright Test Compliance */}
            <span className="shutter-accessible-label">
              {buttonLabel}
            </span>
          </button>
        </div>

        {/* Right Action Terminal: Final Release Pass Authorization */}
        <div className="dock-action-terminal">
          {isComplete ? (
            <button
              id="evaluate-button"
              type="button"
              className="btn-authorize btn-hologram-release"
              onClick={onAuthorize}
            >
              <span className="btn-release-icon">✦</span>
              <span className="btn-release-text">Authorize Release Pass (BR-09)</span>
            </button>
          ) : (
            <div className="dock-standby-indicator">
              <span className="standby-dot" />
              <span className="standby-text">POLICY GATE ACTIVE</span>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
