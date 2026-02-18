import { state } from './state.js';

// ── Top 15 Pickup → Dropoff Routes Table ──────────────────
export function renderTopRoutes() {
  const rows = state.topRoutes;
  if (!rows || !rows.length) return;

  const maxTrips = rows[0].trip_count;
  const tbody = document.querySelector('#routesTable tbody');
  tbody.innerHTML = rows
    .map((r, i) => {
      const pct = (r.trip_count / maxTrips * 100).toFixed(0);
      return `<tr>
        <td><span class="rank-badge">${i + 1}</span></td>
        <td>${r.pickup_zone}</td>
        <td>${r.dropoff_zone}</td>
        <td>${r.trip_count.toLocaleString()}</td>
        <td><div class="trip-bar" style="width:${pct}%"></div></td>
      </tr>`;
    })
    .join('');
}
