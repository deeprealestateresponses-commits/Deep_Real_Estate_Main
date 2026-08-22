/* ============================================================================
   MAP PIN COORDINATES — APPROXIMATE, NOT YET VERIFIED
   ============================================================================

   Every lat/lng below is a best-estimate centroid for the area, good enough to
   drop a pin at city zoom. They have NOT been checked against survey data or
   against Deep Real Estate's own records.

   Before this page goes live, someone who knows Gurgaon should walk this list
   and correct it. Wrong pins on a property site are worse than no pins — a
   buyer sent to the wrong side of Golf Course Road will not come back.

   Anything without an entry here simply does not get a pin. It still appears
   in search, in the filters and in the library below the map, so the page is
   complete either way; the map just shows fewer markers until the rest are
   filled in.
   ========================================================================= */

/** Legend groups — these are the four pin colours on the map. */
export type MapKind = 'sector' | 'builder' | 'masterplan' | 'commercial';

/** What the sheet actually is, used by the Type filter. */
export type MapType = 'Master plan' | 'Sector layout' | 'Township' | 'Industrial';

/** Which town it belongs to, used by the Location filter. */
export type MapArea = 'Gurugram' | 'Manesar' | 'Dharuhera' | 'Sohna';

export type GeoEntry = {
  lat: number;
  lng: number;
  area: MapArea;
};

export const KIND_LABEL: Record<MapKind, string> = {
  sector: 'Sectors',
  builder: 'Builders',
  masterplan: 'Master Plans',
  commercial: 'Commercial',
};

/** Legend / pin colours, drawn from the palette already in use on the site. */
export const KIND_COLOR: Record<MapKind, string> = {
  sector: '#0080c6',
  builder: '#3d8f53',
  masterplan: '#d08700',
  commercial: '#7c3aed',
};

/** Section title → legend group and sheet type. */
export const SECTION_KIND: Record<string, { kind: MapKind; type: MapType }> = {
  'Master Plans': { kind: 'masterplan', type: 'Master plan' },
  'HUDA Sectors': { kind: 'sector', type: 'Sector layout' },
  DLF: { kind: 'builder', type: 'Township' },
  'Sushant Lok': { kind: 'builder', type: 'Township' },
  'South City': { kind: 'builder', type: 'Township' },
  Vatika: { kind: 'builder', type: 'Township' },
  'Builder Projects': { kind: 'builder', type: 'Township' },
  'Udyog Vihar': { kind: 'commercial', type: 'Industrial' },
};

/* Keyed by the map's `name` exactly as it appears in maps-data.ts. */
export const MAP_GEO: Record<string, GeoEntry> = {
  // ---------------------------------------------------------- master plans
  Masterplan: { lat: 28.4595, lng: 77.0266, area: 'Gurugram' },
  Manesar: { lat: 28.354, lng: 76.937, area: 'Manesar' },
  Dharuhera: { lat: 28.205, lng: 76.797, area: 'Dharuhera' },
  'Sohna Masterplan': { lat: 28.247, lng: 77.065, area: 'Sohna' },

  // ------------------------------------------------------------------ DLF
  'DLF 1': { lat: 28.47, lng: 77.09, area: 'Gurugram' },
  'DLF 2': { lat: 28.49, lng: 77.093, area: 'Gurugram' },
  'DLF 3': { lat: 28.494, lng: 77.098, area: 'Gurugram' },
  'DLF 4': { lat: 28.464, lng: 77.09, area: 'Gurugram' },
  'DLF 5': { lat: 28.442, lng: 77.1, area: 'Gurugram' },
  'DLF Alameda': { lat: 28.392, lng: 77.032, area: 'Gurugram' },
  'DLF Garden City': { lat: 28.383, lng: 76.982, area: 'Gurugram' },

  // --------------------------------------------------------- HUDA sectors
  'Sector 4 & 7': { lat: 28.468, lng: 77.017, area: 'Gurugram' },
  'Sector 5': { lat: 28.472, lng: 77.021, area: 'Gurugram' },
  'Sector 7 Ext.': { lat: 28.463, lng: 77.011, area: 'Gurugram' },
  'Sector 7': { lat: 28.466, lng: 77.013, area: 'Gurugram' },
  'Sector 9': { lat: 28.453, lng: 77.008, area: 'Gurugram' },
  'Sector 9A': { lat: 28.449, lng: 77.005, area: 'Gurugram' },
  'Sector 10': { lat: 28.446, lng: 76.998, area: 'Gurugram' },
  'Sector 10A': { lat: 28.443, lng: 76.995, area: 'Gurugram' },
  'Sector 12A': { lat: 28.46, lng: 77.0, area: 'Gurugram' },
  'Sector 14': { lat: 28.47, lng: 77.033, area: 'Gurugram' },
  'Sector 15': { lat: 28.465, lng: 77.04, area: 'Gurugram' },
  'Sector 17': { lat: 28.475, lng: 77.048, area: 'Gurugram' },
  'Sector 21': { lat: 28.479, lng: 77.057, area: 'Gurugram' },
  'Sector 22': { lat: 28.483, lng: 77.064, area: 'Gurugram' },
  'Sector 23': { lat: 28.488, lng: 77.053, area: 'Gurugram' },
  'Sector 23A': { lat: 28.49, lng: 77.049, area: 'Gurugram' },
  'Sector 27 & 28': { lat: 28.469, lng: 77.083, area: 'Gurugram' },
  'Sector 29': { lat: 28.467, lng: 77.073, area: 'Gurugram' },
  'Sector 31 & 32a': { lat: 28.443, lng: 77.041, area: 'Gurugram' },
  'Sector 31': { lat: 28.446, lng: 77.043, area: 'Gurugram' },
  'Sector 32,33,34': { lat: 28.437, lng: 77.034, area: 'Gurugram' },
  'Sector 34': { lat: 28.433, lng: 77.03, area: 'Gurugram' },
  'Sector 38': { lat: 28.427, lng: 77.057, area: 'Gurugram' },
  'Sector 39': { lat: 28.438, lng: 77.053, area: 'Gurugram' },
  'Sector 40': { lat: 28.445, lng: 77.057, area: 'Gurugram' },
  'Sector 43': { lat: 28.452, lng: 77.081, area: 'Gurugram' },
  'Sector 44': { lat: 28.45, lng: 77.074, area: 'Gurugram' },
  'Sector 45': { lat: 28.443, lng: 77.068, area: 'Gurugram' },
  'Sector 46': { lat: 28.436, lng: 77.062, area: 'Gurugram' },
  'Sector 47': { lat: 28.427, lng: 77.048, area: 'Gurugram' },
  'Sector 51': { lat: 28.427, lng: 77.064, area: 'Gurugram' },
  'Sector 52': { lat: 28.436, lng: 77.077, area: 'Gurugram' },
  'Sector 57': { lat: 28.42, lng: 77.08, area: 'Gurugram' },

  // ---------------------------------------------------------- Sushant Lok
  'Sushant LOK 1': { lat: 28.466, lng: 77.062, area: 'Gurugram' },
  'Sushant LOK 2': { lat: 28.427, lng: 77.045, area: 'Gurugram' },
  'Sushant LOK 3': { lat: 28.423, lng: 77.049, area: 'Gurugram' },
  'Sushant LOK 4': { lat: 28.419, lng: 77.043, area: 'Gurugram' },

  // ----------------------------------------------------------- South City
  'South City 1': { lat: 28.448, lng: 77.045, area: 'Gurugram' },
  'South City 2': { lat: 28.41, lng: 77.035, area: 'Gurugram' },

  // --------------------------------------------------------------- Vatika
  /* Vatika India Next, around Sectors 82-83. The phases sit inside one
     township, so they cluster — they are not strung out along a line. */
  'Vatika 1': { lat: 28.3782, lng: 76.9724, area: 'Gurugram' },
  'Vatika 2': { lat: 28.3751, lng: 76.9689, area: 'Gurugram' },
  'Vatika 3': { lat: 28.3733, lng: 76.9741, area: 'Gurugram' },
  'Vatika 4': { lat: 28.3796, lng: 76.9665, area: 'Gurugram' },
  'Vatika 5': { lat: 28.3717, lng: 76.9702, area: 'Gurugram' },

  // ----------------------------------------------------- builder projects
  'Anant RAJ': { lat: 28.408, lng: 77.028, area: 'Gurugram' },
  'Bptp Amstoria': { lat: 28.478, lng: 76.965, area: 'Gurugram' },
  'Emerald Floors': { lat: 28.443, lng: 77.098, area: 'Gurugram' },
  'Greenwood City': { lat: 28.44, lng: 77.052, area: 'Gurugram' },
  'Malibu Town': { lat: 28.409, lng: 77.041, area: 'Gurugram' },
  'Mayfield Garden': { lat: 28.416, lng: 77.058, area: 'Gurugram' },
  Nirvana: { lat: 28.435, lng: 77.075, area: 'Gurugram' },
  Raheja: { lat: 28.398, lng: 77.022, area: 'Gurugram' },
  'Palam Vihar': { lat: 28.507, lng: 77.032, area: 'Gurugram' },
  'Rosewood City': { lat: 28.416, lng: 77.032, area: 'Gurugram' },
  'Saraswati Vihar': { lat: 28.462, lng: 77.048, area: 'Gurugram' },
  'Ireo City': { lat: 28.404, lng: 77.06, area: 'Gurugram' },
  Suncity: { lat: 28.452, lng: 77.086, area: 'Gurugram' },
  'Uppal Southend': { lat: 28.442, lng: 77.031, area: 'Gurugram' },
  'Vipul World': { lat: 28.412, lng: 77.048, area: 'Gurugram' },

  // ---------------------------------------------------------- Udyog Vihar
  'Pace City 1': { lat: 28.498, lng: 77.055, area: 'Gurugram' },
  'Pace City 2': { lat: 28.492, lng: 77.048, area: 'Gurugram' },
  'Udyog Vihar': { lat: 28.503, lng: 77.087, area: 'Gurugram' },
};

/** Where the map opens: Gurugram, wide enough to hold Manesar and Sohna. */
export const GURGAON_CENTER: [number, number] = [28.4425, 77.03];
export const GURGAON_ZOOM = 12;
