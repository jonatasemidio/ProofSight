/**
 * ProofSight — Static Kit Catalog Adapter
 *
 * Implements the fixed eight-component kit required by MVP specification.
 */

import { KitTemplate } from '../domain/entities.js';

export const EIGHT_COMPONENT_KIT = new KitTemplate(
  'technician-kit-a104',
  'Technician Kit A-104',
  '1.0.0',
  [
    { id: 'c1', name: 'Precision Screwdriver', quantity: 1, isMandatory: true, expectedRegion: { x: 20, y: 30, width: 45, height: 140 } },
    { id: 'c2', name: 'Hex Key Set', quantity: 1, isMandatory: true, expectedRegion: { x: 75, y: 30, width: 55, height: 110 } },
    { id: 'c3', name: 'Digital Multimeter', quantity: 1, isMandatory: true, expectedRegion: { x: 140, y: 30, width: 90, height: 150 } },
    { id: 'c4', name: 'Wire Stripper', quantity: 1, isMandatory: true, expectedRegion: { x: 240, y: 30, width: 60, height: 130 } },
    { id: 'c5', name: 'Adjustable Wrench', quantity: 1, isMandatory: true, expectedRegion: { x: 20, y: 190, width: 70, height: 140 } },
    { id: 'c6', name: 'Needle-Nose Pliers', quantity: 1, isMandatory: true, expectedRegion: { x: 100, y: 190, width: 65, height: 140 } },
    { id: 'c7', name: 'Insulation Tape', quantity: 1, isMandatory: true, expectedRegion: { x: 175, y: 190, width: 55, height: 55 } },
    { id: 'c8', name: 'Test Leads Set', quantity: 1, isMandatory: true, expectedRegion: { x: 240, y: 190, width: 60, height: 120 } }
  ],
  '/assets/templates/technician-kit-a104-ref.jpg'
);

export class StaticKitCatalog {
  static getKitById(id) {
    if (id === 'technician-kit-a104') {
      return EIGHT_COMPONENT_KIT;
    }
    return null;
  }

  static listApprovedKits() {
    return [EIGHT_COMPONENT_KIT];
  }
}
