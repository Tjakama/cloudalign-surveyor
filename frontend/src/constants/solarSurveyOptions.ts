export const GRID_STATUS_TYPES = [
  'Stable Single-Phase AC',
  'Stable Three-Phase AC',
  'Unstable / Frequent Load Shedding',
  'Off-Grid / Isolated Site',
] as const;

export const ROOFING_TYPES = [
  'Corrugated Iron / IBR Sheet',
  'Concrete Slab / Flat Roof',
  'Clay / Concrete Tiles',
  'Standing Seam Metal Roof',
  'Ground Mount Rack Structure',
] as const;

export const SOLAR_PANEL_TYPES = [
  'Monocrystalline 550W High-Efficiency',
  'Polycrystalline 400W Standard',
  'Bifacial Solar Panels',
  'Flexible / Rooftop Mount Panels',
] as const;

export const INVERTER_MODELS = [
  'Huawei SUN2000 Hybrid Inverter',
  'Victron Energy MultiPlus-II',
  'Growatt SPF / MIN Hybrid Series',
  'Must Solar PV Inverter',
] as const;

export const BATTERY_BANK_TYPES = [
  'Oliter Gel 12V 100Ah / 200Ah',
  'CNBM LCPC100-12 Gel Battery',
  'Lithium Iron Phosphate (LiFePO4) 48V Rackmount',
  'Tubular Lead-Acid Flooded Battery',
] as const;

// --- CABLING & RUNS ---

export const CABLE_SIZES = [
  '4mm² PV Copper Cable (DC)',
  '6mm² PV Copper Cable (DC)',
  '10mm² Copper Flex Cable',
  '16mm² 3-Core Armoured AC Cable',
  '25mm² Battery Interconnect Cable',
  '35mm² Battery Interconnect Cable',
  '50mm² Main DC Busbar Cable',
] as const;

export const CABLE_LUGS_TYPES = [
  'M6 Copper Tubular Lug (for 6mm² - 10mm²)',
  'M8 Copper Tubular Lug (for 16mm² - 25mm²)',
  'M10 Copper Tubular Lug (for 35mm² - 50mm²)',
  'Bimetallic Lugs (Al-Cu Transition)',
] as const;

export const TRUNKING_SIZES = [
  'PVC Trunking 25mm x 25mm',
  'PVC Trunking 40mm x 40mm',
  'PVC Trunking 50mm x 100mm',
  'Heavy Duty Steel Cable Tray (100mm)',
] as const;

export const CONDUIT_SPECS = [
  {
    type: 'Heavy Duty PVC Conduit',
    sizes: ['20mm', '25mm', '32mm', '50mm'],
  },
  {
    type: 'Galvanized Steel Conduit (Class 4)',
    sizes: ['20mm', '25mm', '32mm', '50mm'],
  },
  {
    type: 'Flexible Corrugated Conduit',
    sizes: ['20mm', '25mm', '32mm'],
  },
] as const;

export const CONDUIT_ACCESSORIES = {
  endBoxes: ['Inspection End Box (Through)', 'Terminal Box (1-Way)', 'Angle Box (2-Way 90°)'],
  elbows: ['Solid Elbow 90°', 'Inspection Bend', 'Flexible Bend Joint'],
} as const;

// --- ELECTRICAL PROTECTION & SAFETY DEVICES ---

export const DC_BREAKER_SIZES = [
  'DC MCB 16A 500V/1000V (String Protection)',
  'DC MCB 32A 500V/1000V',
  'DC MCB 63A 1000V (Inverter DC Isolator)',
  'DC Moulded Case Circuit Breaker (MCCB) 125A',
] as const;

export const AC_BREAKER_SIZES = [
  'AC MCB Single-Phase 16A (Inverter Output)',
  'AC MCB Single-Phase 32A',
  'AC MCB Three-Phase 32A (4-Pole)',
  'AC MCB Three-Phase 63A (4-Pole)',
  'Earth Leakage Protection (RCCB / RCBO 63A 30mA)',
] as const;

export const SURGE_PROTECTION_DEVICES = [
  'DC Surge Protection Device (SPD) Type 2 - 600V/1000V',
  'AC Surge Protection Device (SPD) Type 2 - 275V/400V',
  'Combined AC/DC SPD Box with Integrated Fuses',
] as const;

export const COMBINER_BOX_TYPES = [
  '2-String In / 1-Out DC Combiner Box (IP65)',
  '4-String In / 2-Out DC Combiner Box with Fuses (IP65)',
  '6-String In / 3-Out DC Combiner Box with SPDs',
  'Custom Wall-Mount Weatherproof Enclosure',
] as const;

export const PV_STRING_FUSES = [
  '10A 1000V DC Cylindrical Fuse Link',
  '15A 1000V DC Cylindrical Fuse Link',
  '20A 1000V DC Cylindrical Fuse Link',
  'NH00 Fuse Switch Disconnector Base',
] as const;