// ── Shared mutable application state ──────────────────────
export const state = {
  summary: null,
  tripsByHour: [],
  tripsByDay: [],
  fareByBorough: [],
  fareVsDistance: [],
  topPickupZones: [],
  topRoutes: [],
  geojson: null,
  boroughStats: [],
  leafletMap: null,
  geoLayer: null,
};

// Chart instances (keyed by name so any module can destroy/replace them)
export const charts = {
  hour: null,
  day: null,
  fareBorough: null,
  scatter: null,
  topZones: null,
};
