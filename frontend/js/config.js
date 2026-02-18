// ── API endpoints (relative – served by Flask on same origin) ──
export const ENDPOINTS = {
  summary:        '/api/summary',
  tripsByHour:    '/api/trips-by-hour',
  tripsByDay:     '/api/trips-by-day',
  fareByBorough:  '/api/avg-fare-by-borough',
  fareVsDistance: '/api/fare-vs-distance',
  topPickupZones: '/api/top-pickup-zones',
  topRoutes:      '/api/top-routes',
  geojson:        '/api/geojson',
  boroughStats:   '/api/borough-stats',
};

// ── Chart.js colour palette ───────────────────────────────
export const CHART_COLORS = [
  '#6c63ff', '#00c9a7', '#ff6b6b', '#ffd93d',
  '#45b7d1', '#96ceb4', '#ff9ff3', '#f8b500',
  '#2ecc71', '#e74c3c', '#3498db', '#9b59b6',
];

// ── Chart.js global defaults ──────────────────────────────
export function applyChartDefaults() {
  Chart.defaults.color = '#64748b';
  Chart.defaults.borderColor = '#e5e7eb';
  Chart.defaults.font.family = "'Segoe UI', system-ui, sans-serif";
}
