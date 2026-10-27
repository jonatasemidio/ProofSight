import React, { useState, useEffect, useRef } from 'react';
import { InspectionClientACL } from './ui/acl/inspection-client.js';
import CockpitHeader from './ui/components/CockpitHeader.jsx';
import SpatialAROverlay from './ui/components/SpatialAROverlay.jsx';
import AngleGuidanceHUD from './ui/components/AngleGuidanceHUD.jsx';
import TacticalShutter from './ui/components/TacticalShutter.jsx';
import ToolDeck from './ui/components/ToolDeck.jsx';
import CertificateModal from './ui/components/CertificateModal.jsx';
import SupervisorModal from './ui/components/SupervisorModal.jsx';
import { sound } from './utils/audio.js';

const PRESET_SCENARIOS = [
  { 
    id: 'occluded', 
    label: 'Scenario: Partially Obscured Tool', 
    src: '/assets/photos/kit_occluded.jpg', 
    occluded: ['c1'], 
    missing: [], 
    blur: 170 
  },
  { 
    id: 'complete', 
    label: 'Scenario: 100% Complete Kit', 
    src: '/assets/photos/kit_complete.jpg', 
    occluded: [], 
    missing: [], 
    blur: 185 
  },
  { 
    id: 'missing', 
    label: 'Scenario: Missing Screwdriver', 
    src: '/assets/photos/kit_missing.jpg', 
    occluded: [], 
    missing: ['c1'], 
    blur: 180 
  },
  { 
    id: 'blurry', 
    label: 'Scenario: Blurry Photo (Quality Gate)', 
    src: '/assets/photos/kit_blurry.jpg', 
    occluded: [], 
    missing: [], 
    blur: 32 
  }
];

export default function App() {
  const [acl] = useState(() => new InspectionClientACL());
  const [state, setState] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(PRESET_SCENARIOS[0].src);
  const [selectedScenarioId, setSelectedScenarioId] = useState(PRESET_SCENARIOS[0].id);
  const [isCapturing, setIsCapturing] = useState(false);
  const [activeToolId, setActiveToolId] = useState(null);
  const [verdictModal, setVerdictModal] = useState(null);
  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [isUsingWebcam, setIsUsingWebcam] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function init() {
      const initial = await acl.initializeInspection('technician-kit-a104');
      setState(initial);
    }
    init();
  }, [acl]);

  const activeScenario = PRESET_SCENARIOS.find(s => s.id === selectedScenarioId) || PRESET_SCENARIOS[0];

  // Hardware Camera Feed Toggle
  const toggleWebcam = async () => {
    if (isUsingWebcam) {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
      setIsUsingWebcam(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsUsingWebcam(true);
      } catch (err) {
        alert('Hardware camera unavailable. Falling back to high-resolution calibrated kit photographs.');
      }
    }
  };

  // Custom File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target.result;
        setCurrentPhoto(src);
        setIsUsingWebcam(false);
        triggerAnalysis(src, { blurVariance: 165, exposureMean: 130, simulatedOcclusions: [] });
      };
      reader.readAsDataURL(file);
    }
  };

  // Primary Shutter Execution
  const handleShutter = async () => {
    setIsCapturing(true);
    sound.playShutter();

    let photoSrc = currentPhoto;
    let telemetry = {
      blurVariance: activeScenario.blur,
      exposureMean: 130,
      simulatedOcclusions: activeScenario.occluded,
      simulatedMissing: activeScenario.missing
    };

    // Adaptive branch: follow-up capture in occluded scenario resolves the tool
    if (activeScenario.id === 'occluded' && state.attemptCount >= 1) {
      photoSrc = PRESET_SCENARIOS[1].src; // complete photo
      telemetry.simulatedOcclusions = [];
      setCurrentPhoto(photoSrc);
    }

    setTimeout(async () => {
      await triggerAnalysis(photoSrc, telemetry);
      setIsCapturing(false);
    }, 650);
  };

  const triggerAnalysis = async (photoSrc, telemetry) => {
    try {
      const updated = await acl.captureAndAnalyze(telemetry, photoSrc);
      setState(updated);

      if (updated.verifiedCount === updated.totalCount) {
        sound.playScanSuccess();
      } else if (telemetry.blurVariance < 100) {
        sound.playAlert();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectScenario = (scenarioId) => {
    setSelectedScenarioId(scenarioId);
    const scenario = PRESET_SCENARIOS.find(s => s.id === scenarioId) || PRESET_SCENARIOS[0];
    setCurrentPhoto(scenario.src);
    setIsUsingWebcam(false);
    acl.initializeInspection().then(setState);
  };

  const handleAuthorize = async () => {
    const res = await acl.requestFinalVerdict();
    setVerdictModal(res.verdict);
    setState(res.session);
    if (res.verdict.status === 'PASSED') {
      sound.playScanSuccess();
    }
  };

  const handleSupervisorOverrideSubmit = async (overrideData) => {
    const updated = await acl.submitSupervisorOverride(
      overrideData.reviewerId,
      overrideData.targetComponentId,
      overrideData.reason
    );
    setState(updated);
    setOverrideModalOpen(false);
    sound.playScanSuccess();
  };

  if (!state) {
    return (
      <div className="cockpit-boot-loader">
        <div className="loader-hud-ring" />
        <span className="loader-label">INITIALIZING PROOFSIGHT COCKPIT AVIONICS...</span>
      </div>
    );
  }

  const isComplete = state.verifiedCount === state.totalCount;
  const isBlurryPhoto = state.observations[state.observations.length - 1]?.metrics?.isBlurry;
  const hasGuidance = Boolean(state.activeGuidance);

  return (
    <div className="aerospace-cockpit-chassis">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Top Avionics Mission Header */}
      <CockpitHeader
        kitName={state.kitName}
        verifiedCount={state.verifiedCount}
        totalCount={state.totalCount}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          const next = !soundEnabled;
          setSoundEnabled(next);
          sound.enabled = next;
        }}
        scenarios={PRESET_SCENARIOS}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        isUsingWebcam={isUsingWebcam}
        onToggleWebcam={toggleWebcam}
        onUploadClick={() => fileInputRef.current?.click()}
      />

      {/* Main Mission Tactical Workspace */}
      <main className="cockpit-split-deck">
        {/* Left Column: Optical Sensor Station & Shutter Console */}
        <section className="sensor-station-column" aria-label="Optical Sensor Station">
          <div className="viewport-bezel-frame">
            {/* Viewfinder Telemetry Header */}
            <div className="viewport-status-bar">
              <div className="status-cell">
                <span className="live-sensor-dot" />
                <span className="sensor-id">SENSOR 01 • OPENCV HOMOGRAPHY</span>
              </div>
              <div className="status-cell telemetry-readout">
                <span>ATTEMPTS: {state.attemptCount}/3</span>
                <span className="divider">|</span>
                <span>FOCAL: 28MM</span>
                <span className="divider">|</span>
                <span className={isBlurryPhoto ? 'gate-fail' : 'gate-pass'}>
                  GATE: {isBlurryPhoto ? 'BLUR REJECTED' : 'RESOLVED'}
                </span>
              </div>
            </div>

            {/* Viewfinder Canvas Area */}
            <div className="viewport-canvas-enclosure">
              {isUsingWebcam ? (
                <video ref={videoRef} autoPlay playsInline className="sensor-media-element captured-image" />
              ) : (
                <img
                  src={currentPhoto}
                  alt="Optical Inspection Frame"
                  className={`sensor-media-element captured-image ${selectedScenarioId === 'blurry' && state.attemptCount > 0 ? 'simulated-blur' : ''}`}
                />
              )}

              {/* Spatial AR Holographic Overlay */}
              <SpatialAROverlay
                findings={state.findings}
                activeToolId={activeToolId}
                onSelectTool={setActiveToolId}
                isScanning={isCapturing}
              />

              {/* Inclinometer & Artificial Horizon Active Guidance HUD */}
              <AngleGuidanceHUD
                guidance={state.activeGuidance}
                isBlurry={isBlurryPhoto}
                isComplete={isComplete}
              />

              {/* Viewfinder Precision Framing Calibrations */}
              <div className="optical-bezel-overlay" pointer-events="none">
                <div className="reticle-mark corner-top-left" />
                <div className="reticle-mark corner-top-right" />
                <div className="reticle-mark corner-bottom-left" />
                <div className="reticle-mark corner-bottom-right" />
                <div className="optical-crosshair-center" />
                <div className="optical-grid-rulers">
                  <span className="ruler-tick top">0MM</span>
                  <span className="ruler-tick center">150MM</span>
                  <span className="ruler-tick bottom">300MM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Camera Command Bar docked directly under the Viewport */}
          <TacticalShutter
            verifiedCount={state.verifiedCount}
            totalCount={state.totalCount}
            isComplete={isComplete}
            isCapturing={isCapturing}
            onClick={handleShutter}
            onAuthorize={handleAuthorize}
            attemptCount={state.attemptCount}
            hasGuidance={hasGuidance}
          />
        </section>

        {/* Right Column: Digital Twin Manifest & Real-Time Telemetry */}
        <section className="digital-twin-deck-panel">
          <ToolDeck
            findings={state.findings}
            activeToolId={activeToolId}
            onSelectTool={setActiveToolId}
            onOpenSupervisorOverride={() => setOverrideModalOpen(true)}
          />
        </section>
      </main>

      {/* Holographic Security Certificate Modal */}
      <CertificateModal
        verdict={verdictModal}
        onClose={() => setVerdictModal(null)}
      />

      {/* Supervisor Exception Override Modal */}
      <SupervisorModal
        isOpen={overrideModalOpen}
        onClose={() => setOverrideModalOpen(false)}
        findings={state.findings}
        onSubmit={handleSupervisorOverrideSubmit}
      />
    </div>
  );
}
