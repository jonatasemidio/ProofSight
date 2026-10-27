import React from 'react';

// Calibrated normalized coordinates (% of 740x510 foam insert)
export const TOOL_COORDINATES = {
  c3: { x: 6, y: 5, w: 24, h: 62, icon: 'multimeter', shortName: 'Multimeter', slot: 'C3' },
  c4: { x: 31, y: 4, w: 15, h: 56, icon: 'stripper', shortName: 'Stripper', slot: 'C4' },
  c1: { x: 52, y: 4, w: 22, h: 56, icon: 'screwdriver', shortName: 'Screwdriver', slot: 'C1' },
  c5: { x: 74, y: 4, w: 15, h: 67, icon: 'wrench', shortName: 'Wrench', slot: 'C5' },
  c2: { x: 86, y: 27, w: 12, h: 48, icon: 'hexkeys', shortName: 'Hex Keys', slot: 'C2' },
  c6: { x: 46, y: 34, w: 12, h: 56, icon: 'pliers', shortName: 'Pliers', slot: 'C6' },
  c7: { x: 61, y: 64, w: 13, h: 25, icon: 'tape', shortName: 'Tape', slot: 'C7' },
  c8: { x: 3.5, y: 71, w: 38, h: 19, icon: 'leads', shortName: 'Test Leads', slot: 'C8' }
};

export default function SpatialAROverlay({ 
  findings = [], 
  activeToolId, 
  onSelectTool, 
  isScanning = false 
}) {
  return (
    <div className="spatial-ar-canvas" aria-hidden="true">
      {/* Laser Scanning Homography Beam */}
      {isScanning && (
        <div className="ar-laser-beam">
          <div className="laser-beam-flare" />
        </div>
      )}

      {/* Homography Alignment Reticles */}
      <svg className="ar-homography-grid" width="100%" height="100%">
        <defs>
          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.05)" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>

      {/* Target Acquisition Brackets */}
      {findings.map(item => {
        const coords = TOOL_COORDINATES[item.id];
        if (!coords) return null;

        const isHighlighted = activeToolId === item.id;
        const isVerified = item.status === 'VERIFIED';
        const isUnresolved = item.status === 'UNRESOLVED';
        const isMissing = item.status === 'SUSPECTED_MISSING';
        const isPending = item.status === 'NOT_OBSERVED';

        let statusClass = 'pending';
        if (isVerified) statusClass = 'verified';
        else if (isUnresolved) statusClass = 'unresolved';
        else if (isMissing) statusClass = 'missing';

        return (
          <div
            key={item.id}
            className={`ar-bracket-container ${statusClass} ${isHighlighted ? 'focused' : ''}`}
            style={{
              left: `${coords.x}%`,
              top: `${coords.y}%`,
              width: `${coords.w}%`,
              height: `${coords.h}%`
            }}
            onClick={() => onSelectTool && onSelectTool(item.id)}
            role="button"
            tabIndex={0}
            aria-label={`${item.name}: ${item.status}`}
          >
            {/* Precision Chamfered Target Reticles */}
            <span className="ar-bracket-corner corner-tl" />
            <span className="ar-bracket-corner corner-tr" />
            <span className="ar-bracket-corner corner-bl" />
            <span className="ar-bracket-corner corner-br" />

            {/* Target Crosshair */}
            <div className="ar-crosshair" />

            {/* Tactical Avionics Telemetry Tag */}
            <div className="ar-telemetry-tag">
              <span className="tag-slot-badge">{coords.slot}</span>
              <span className="tag-name">{coords.shortName}</span>
              
              {isVerified && (
                <span className="tag-status-indicator pass">✓ 99%</span>
              )}
              {isUnresolved && (
                <span className="tag-status-indicator warn">▲ 45°</span>
              )}
              {isMissing && (
                <span className="tag-status-indicator fail">✕ VOID</span>
              )}
              {isPending && (
                <span className="tag-status-indicator pending">READY</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
