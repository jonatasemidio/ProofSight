import React from 'react';

// Custom precision aerospace vector schematics for each tool
const TOOL_SCHEMATICS = {
  c1: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M14 3l7 7-2 2-7-7 2-2z" />
      <path d="M12 5L4 13l-1 5 5-1 8-8" />
      <path d="M7 17l-4 4" />
      <circle cx="16.5" cy="7.5" r="1.5" />
    </svg>
  ),
  c2: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M6 3h12v4H10v14H6V3z" />
      <path d="M9 7h9v3h-6v11H9V7z" opacity="0.6" />
      <path d="M12 11h9v3h-6v7h-3v-10z" opacity="0.4" />
    </svg>
  ),
  c3: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <rect x="7" y="5" width="10" height="5" rx="1" strokeWidth="1.2" />
      <circle cx="12" cy="15" r="3" />
      <line x1="12" y1="13" x2="12" y2="15" strokeLinecap="round" />
      <circle cx="8" cy="19" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
      <circle cx="16" cy="19" r="1" fill="currentColor" />
    </svg>
  ),
  c4: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M6 3l5 6m2 0l5-6" />
      <path d="M10 9l-5 12m9-12l5 12" />
      <circle cx="12" cy="10" r="2" />
      <line x1="8" y1="6" x2="16" y2="6" strokeDasharray="1 2" />
    </svg>
  ),
  c5: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M17 3a4 4 0 0 0-4 4l-8 8a2 2 0 0 0 3 3l8-8a4 4 0 0 0 4-4l-3 1-1-3 1-1z" />
      <circle cx="7" cy="17" r="1" />
    </svg>
  ),
  c6: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M10 2l2 8m0 0l2-8" />
      <circle cx="12" cy="11" r="2" />
      <path d="M10 12l-4 9m8-9l4 9" />
    </svg>
  ),
  c7: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="2" strokeDasharray="1 1" />
    </svg>
  ),
  c8: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="tool-schematic-svg">
      <path d="M3 8c4-4 8 0 12-4s6 2 6 2" />
      <path d="M3 16c4-4 8 0 12-4s6 2 6 2" opacity="0.6" />
      <rect x="19" y="4" width="3" height="4" rx="1" />
      <rect x="19" y="12" width="3" height="4" rx="1" />
      <line x1="2" y1="8" x2="4" y2="8" />
      <line x1="2" y1="16" x2="4" y2="16" />
    </svg>
  )
};

export default function ToolDeck({
  findings = [],
  activeToolId,
  onSelectTool,
  onOpenSupervisorOverride
}) {
  const verifiedCount = findings.filter(f => f.status === 'VERIFIED').length;
  const totalCount = findings.length;
  const hasExceptions = findings.some(f => f.status !== 'VERIFIED');

  return (
    <section className="tool-manifest-section" aria-label="Digital Twin Manifest">
      <div className="manifest-header-bar">
        <div className="manifest-identity">
          <div className="manifest-radar-icon">
            <span className="radar-sweep" />
          </div>
          <div>
            <h2 className="manifest-title">Digital Twin Manifest</h2>
            <span className="manifest-subtitle">Real-time Compartment Telemetry</span>
          </div>
        </div>

        <div className="manifest-status-counter">
          <span className="counter-led" />
          <span className="counter-digits">{verifiedCount} / {totalCount} LOCKED</span>
        </div>
      </div>

      <div className="manifest-bento-grid">
        {findings.map(tool => {
          const schematic = TOOL_SCHEMATICS[tool.id] || TOOL_SCHEMATICS.c5;
          const isFocused = activeToolId === tool.id;
          const isVerified = tool.status === 'VERIFIED';
          const isUnresolved = tool.status === 'UNRESOLVED';
          const isMissing = tool.status === 'SUSPECTED_MISSING';
          const isPending = tool.status === 'NOT_OBSERVED';

          let statusTheme = 'pending';
          let statusText = 'Pending';
          let confScore = 0;

          if (isVerified) {
            statusTheme = 'verified';
            statusText = 'Verified';
            confScore = 99;
          } else if (isUnresolved) {
            statusTheme = 'unresolved';
            statusText = 'Angle Needed';
            confScore = 48;
          } else if (isMissing) {
            statusTheme = 'missing';
            statusText = 'Missing';
            confScore = 12;
          }

          return (
            <div
              key={tool.id}
              className={`tactical-tool-card ${statusTheme} ${isFocused ? 'focused' : ''}`}
              onMouseEnter={() => onSelectTool && onSelectTool(tool.id)}
              onMouseLeave={() => onSelectTool && onSelectTool(null)}
              onClick={() => onSelectTool && onSelectTool(tool.id)}
              role="button"
              tabIndex={0}
              aria-label={`${tool.name} - Slot ${tool.id.toUpperCase()}`}
            >
              <div className="card-top-row">
                <div className="schematic-badge">
                  {schematic}
                </div>
                <span className={`mil-status-badge ${statusTheme}`}>
                  {statusText}
                </span>
              </div>

              <div className="card-body">
                <span className="card-slot-id">SLOT {tool.id.toUpperCase()}</span>
                <h3 className="card-tool-name">{tool.name}</h3>
              </div>

              {/* Confidence Meter Bar */}
              <div className="card-confidence-bar">
                <div className="bar-track">
                  <div
                    className={`bar-fill ${statusTheme}`}
                    style={{ width: `${confScore}%` }}
                  />
                </div>
                <span className="bar-label">{confScore}% CONF</span>
              </div>

              {tool.reason && (
                <div className="card-alert-strip">
                  <span className="alert-strip-icon">⚠</span>
                  <span className="alert-strip-text">{tool.reason}</span>
                </div>
              )}

              {/* Chamfered Tech Edge Accent */}
              <span className="chamfer-corner tl" />
              <span className="chamfer-corner br" />
            </div>
          );
        })}
      </div>

      {/* Military-Grade Supervisor Escalation Terminal */}
      {hasExceptions && (
        <div className="supervisor-escalation-terminal">
          <div className="escalation-info">
            <span className="escalation-beacon">⚡</span>
            <div>
              <span className="escalation-title">Security & Protocol Override (BR-10)</span>
              <p className="escalation-desc">Unresolved or missing components require authorized sign-off.</p>
            </div>
          </div>
          <button
            id="supervisor-review-btn"
            type="button"
            className="btn-escalation-action"
            onClick={onOpenSupervisorOverride}
          >
            Authorize Supervisor Exception
          </button>
        </div>
      )}
    </section>
  );
}
