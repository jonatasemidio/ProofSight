import React from 'react';

export default function AngleGuidanceHUD({ guidance, isBlurry, isComplete }) {
  if (!guidance && !isBlurry && !isComplete) return null;

  return (
    <div className={`inclinometer-hud-overlay ${isBlurry ? 'blur-warning' : isComplete ? 'clearance-granted' : 'active-guidance'}`}>
      {/* 3D Pitch Inclinometer Reticle */}
      <div className="inclinometer-gyro-assembly">
        <div className="gyro-artificial-horizon">
          <div className="horizon-line left" />
          <div className="horizon-cross-circle">
            <span className="cross-dot" />
          </div>
          <div className="horizon-line right" />
        </div>

        {/* Pitch Degree Ticks */}
        <div className="pitch-ladder">
          <div className="pitch-rung target-45">
            <span className="rung-label target">TARGET 45°</span>
            <span className="rung-bar target" />
            <div className="rung-direction-arrow">▲ TILT +25°</div>
          </div>
          <div className="pitch-rung level-0">
            <span className="rung-label">0° NADIR</span>
            <span className="rung-bar" />
          </div>
        </div>
      </div>

      {/* Optical Telemetry Status Badge */}
      <div className="guidance-hud-readout guidance-card">
        <div className="hud-readout-header">
          <span className="hud-beacon-pulse" />
          <span className="hud-readout-title">
            {isComplete
              ? 'SYSTEM CLEARANCE: PASS (BR-09)'
              : isBlurry
              ? 'IMAGE QUALITY REJECTED (BR-06)'
              : 'AGENT TARGETED ANGLE GUIDANCE (BR-05)'}
          </span>
        </div>
        <p className="hud-readout-message">
          {guidance?.guidanceMessage || (isBlurry ? 'Camera image blurred. Re-acquire with steady focal lock.' : 'Inspection criteria satisfied.')}
        </p>
      </div>
    </div>
  );
}
