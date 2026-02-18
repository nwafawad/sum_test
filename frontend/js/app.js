// ── Main entry point ──────────────────────────────────────
import { ENDPOINTS, applyChartDefaults } from './config.js';
import { state } from './state.js';
import { fetchAPI, hideLoading } from './dataLoader.js';
import { renderKPIs } from './kpi.js';
import { renderTripsByHour, renderTripsByDay, renderFareByBorough, renderScatter, renderTopZones } from './charts.js';
import { renderMap, bindMapEvents } from './map.js';
import { renderTopRoutes } from './routes.js';

// ── Render everything (called after each filter change) ───
export function renderAll() {
  renderKPIs();
  renderTripsByHour();
  renderTripsByDay();
  renderMap();
  renderFareByBorough();
  renderScatter();
  renderTopRoutes();
  renderTopZones();
}

// ── Bootstrap ─────────────────────────────────────────────
async function init() {
  applyChartDefaults();
  try {
    // Fetch all API data in parallel
    const [
      summary, tripsByHour, tripsByDay, fareByBorough,
      fareVsDistance, topPickupZones, topRoutes, geojson
    ] = await Promise.all([
      fetchAPI(ENDPOINTS.summary),
      fetchAPI(ENDPOINTS.tripsByHour),
      fetchAPI(ENDPOINTS.tripsByDay),
      fetchAPI(ENDPOINTS.fareByBorough),
      fetchAPI(ENDPOINTS.fareVsDistance),
      fetchAPI(ENDPOINTS.topPickupZones),
      fetchAPI(ENDPOINTS.topRoutes),
      fetchAPI(ENDPOINTS.geojson),
    ]);

    // Store in shared state
    state.summary        = summary;
    state.tripsByHour    = tripsByHour;
    state.tripsByDay     = tripsByDay;
    state.fareByBorough  = fareByBorough;
    state.fareVsDistance = fareVsDistance;
    state.topPickupZones = topPickupZones;
    state.topRoutes      = topRoutes;
    state.geojson        = geojson;

    console.log('API data loaded successfully');

    bindMapEvents();
    renderAll();
    hideLoading();
  } catch (err) {
    console.error('Failed to load data:', err);
    document.getElementById('loadingOverlay').innerHTML =
      `<p style="color:var(--accent3);text-align:center;max-width:500px;">
        <strong>Error loading data.</strong><br>
        Make sure the Flask API is running on <code>http://localhost:5000</code>
        and the database <code>database/taxi_data.db</code> exists.<br><br>
        <span style="font-size:.8rem;color:var(--text-dim);">${err.message}</span>
      </p>`;
  }
}

document.addEventListener('DOMContentLoaded', init);
