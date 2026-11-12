export const ENVIRONMENT_TYPES = [
  'Indoor Office',
  'Open Plan Hospitality',
  'Outdoor High-Density',
  'Industrial',
] as const;

export const WALL_MATERIALS = [
  'Drywall',
  'Brick',
  'Reinforced Concrete',
  'Stone / Masonry',
  'Glass',
] as const;

export const CEILING_TYPES = [
  'Drop Ceiling (T-Bar)',
  'Concrete Slab',
  'Wooden Beams',
  'Open Metal Roof',
] as const;

export const MOUNTING_METHODS = [
  'Flush Ceiling',
  'Wall Bracket',
  'Drop Pole',
  'Outdoor Mast',
] as const;

export const AP_MODELS = [
  'Grandstream GWN7660',
  'Grandstream GWN7664',
  'Grandstream GWN7630LR (Outdoor)',
  'Ubiquiti UniFi U6 Pro',
  'Ubiquiti UniFi U6 Mesh',
] as const;

export const POE_SWITCH_MODELS = [
  'Grandstream GWN7802P',
  'Grandstream GWN7803P',
  'MikroTik cEX / CRS Series',
  'Cisco Catalyst 1000',
] as const;

export const BACKHAUL_TYPES = [
  'Wired Cat6',
  'Wireless Mesh (5 GHz)',
] as const;