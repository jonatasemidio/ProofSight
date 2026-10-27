import React from 'react';

export default function CockpitHeader({
  kitName = 'Technician Kit A-104',
  verifiedCount = 0,
  totalCount = 8,
  soundEnabled = true,
  onToggleSound,
  scenarios = [],
  selectedScenarioId,
  onSelectScenario,
  isUsingWebcam,
  onToggleWebcam,
  onUploadClick
}) {
  const isComplete = totalCount > 0 && verifiedCount === totalCount;

  return (
    <header className="cockpit-hud-header" role="banner">
      {/* Brand & Systems Identification */}
      <div className="header-brand-cluster">
        <div className="aerospace-prism-logo">
          <svg className="prism-svg" viewBox="0 0 36 36" fill="none">
            <polygon points="18,3 32,10 32,26 18,33 4,26 4,10" stroke="#00f0ff" strokeWidth="2" fill="rgba(0, 240, 255, 0.12)" />
            <circle cx="18" cy="18" r="5" fill="#00f0ff" />
            <line x1="18" y1="3" x2="18" y2="13" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="32" y1="26" x2="22" y2="21" stroke="#00f0ff" strokeWidth="1.5" />
            <line x1="4" y1="26" x2="14" y2="21" stroke="#00f0ff" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="brand-text-block">
          <div className="brand-title-line">
            <span className="brand-name">ProofSight</span>
            <span className="brand-version-badge">INSPECTION AGENT v2.4</span>
          </div>
          <span className="brand-classification">Autonomous Visual Evidence & Spatial Guidance</span>
        </div>
      </div>

      {/* Center Mission & Telemetry Badges */}
      <div className="header-mission-strip">
        <div className="mission-pill kit-identity">
          <span className="pill-pulse-lamp online" />
          <span className="kit-name">{kitName}</span>
        </div>

        <div className={`mission-pill status-gauge ${isComplete ? 'pass' : 'scanning'}`}>
          <span className="pill-pulse-lamp status" />
          <span className="checklist-ratio">
            {verifiedCount}/{totalCount} Verified
          </span>
        </div>
      </div>

      {/* Right Tactical Cockpit Controls */}
      <div className="header-actions-deck">
        {/* Scenario Selector Ribbon */}
        <div className="tactical-scenario-ribbon">
          <span className="ribbon-label">SCENARIO:</span>
          {/* Native select preserved for Playwright .sample-select compatibility */}
          <select
            className="sample-select native-scenario-select"
            value={selectedScenarioId}
            onChange={e => onSelectScenario(e.target.value)}
            aria-label="Select Test Scenario"
          >
            {scenarios.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Live Camera Feed Toggle */}
        <button
          type="button"
          className={`btn-tactical-switch ${isUsingWebcam ? 'active' : ''}`}
          onClick={onToggleWebcam}
          title="Toggle Hardware Camera"
        >
          <span className="switch-led" />
          <span className="switch-text">{isUsingWebcam ? 'LIVE CAM' : 'OPTICAL CAM'}</span>
        </button>

        {/* Manual Image Ingest */}
        <button
          type="button"
          className="btn-tactical-switch upload-btn"
          onClick={onUploadClick}
          title="Ingest Image File"
        >
          <span className="switch-text">UPLOAD FRAME</span>
        </button>

        {/* Audio Haptic Synthesizer Toggle */}
        <button
          type="button"
          className={`btn-audio-haptic ${soundEnabled ? 'active' : 'muted'}`}
          onClick={onToggleSound}
          title={soundEnabled ? 'Acoustic Synthesizer Active' : 'Mute Synthesizer'}
          aria-label={soundEnabled ? 'Mute Scanner Audio' : 'Enable Scanner Audio'}
        >
          {soundEnabled ? (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27l4.73 4.73H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
