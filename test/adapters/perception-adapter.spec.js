import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StaticKitCatalog } from '../../src/adapters/kit-catalog.js';
import { OpenCVPerceptionAdapter } from '../../src/adapters/perception-adapter.js';

describe('TASK-005: Kit Catalog & OpenCV Perception Adapter', () => {
  it('loads predefined eight-component kit "Technician Kit A-104"', () => {
    const kit = StaticKitCatalog.getKitById('technician-kit-a104');
    assert.ok(kit);
    assert.equal(kit.id, 'technician-kit-a104');
    assert.equal(kit.components.length, 8);
    assert.equal(kit.components[0].name, 'Precision Screwdriver');
    assert.equal(kit.components.every(c => c.isMandatory), true);
  });

  it('measures image quality: detects blur when simulated blur variance is low', () => {
    const perception = new OpenCVPerceptionAdapter();
    const result = perception.analyzeImage({
      blurVariance: 42,
      exposureMean: 125,
      simulatedOcclusions: []
    }, StaticKitCatalog.getKitById('technician-kit-a104'));

    assert.equal(result.quality.blurVariance, 42);
    assert.equal(result.quality.isBlurry, true);
  });

  it('measures component features and detects occlusion for targeted component', () => {
    const perception = new OpenCVPerceptionAdapter();
    const kit = StaticKitCatalog.getKitById('technician-kit-a104');
    const result = perception.analyzeImage({
      blurVariance: 180,
      exposureMean: 130,
      simulatedOcclusions: ['c1'] // Screwdriver partly occluded
    }, kit);

    assert.equal(result.quality.isBlurry, false);
    assert.equal(result.componentMeasurements.length, 8);
    
    const c1Measure = result.componentMeasurements.find(m => m.componentId === 'c1');
    assert.equal(c1Measure.isOccluded, true);
    assert.ok(c1Measure.coverageRatio < 0.6);

    const c2Measure = result.componentMeasurements.find(m => m.componentId === 'c2');
    assert.equal(c2Measure.isOccluded, false);
    assert.ok(c2Measure.featureMatches >= 40);
  });
});
