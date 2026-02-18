import { state, charts } from './state.js';
import { CHART_COLORS } from './config.js';

function destroyChart(name) {
  if (charts[name]) { charts[name].destroy(); charts[name] = null; }
}

// ── 1. Trips by Hour of Day ─────────────────────────────────
export function renderTripsByHour() {
  const rows = state.tripsByHour;
  if (!rows || !rows.length) return;
  const labels = rows.map(r => `${r.hour}:00`);
  const data = rows.map(r => r.trip_count);

  destroyChart('hour');
  charts.hour = new Chart(document.getElementById('chartHour'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Trips',
        data,
        backgroundColor: rows.map(r =>
          (r.hour >= 7 && r.hour <= 10) || (r.hour >= 17 && r.hour <= 20) ? '#ff6b6b' : '#6c63ff'
        ),
        borderRadius: 4,
        maxBarThickness: 32,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toLocaleString()} trips` } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v } },
      },
    },
  });
}

// ── 2. Trips by Day of Week ─────────────────────────────────
export function renderTripsByDay() {
  const rows = state.tripsByDay;
  if (!rows || !rows.length) return;
  const labels = rows.map(r => r.day.slice(0, 3));
  const data = rows.map(r => r.trip_count);

  destroyChart('day');
  charts.day = new Chart(document.getElementById('chartDay'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Trips',
        data,
        backgroundColor: rows.map(r =>
          r.day === 'Saturday' || r.day === 'Sunday' ? '#ffd93d' : '#00c9a7'
        ),
        borderRadius: 4,
        maxBarThickness: 48,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y.toLocaleString()} trips` } },
      },
      scales: {
        x: { grid: { display: false } },
        y: { beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v } },
      },
    },
  });
}

// ── 3. Average Fare by Borough ──────────────────────────────
export function renderFareByBorough() {
  const rows = state.fareByBorough;
  if (!rows || !rows.length) return;
  const labels = rows.map(r => r.borough);
  const avgs = rows.map(r => r.avg_fare);

  destroyChart('fareBorough');
  charts.fareBorough = new Chart(document.getElementById('chartFareBorough'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Avg Fare ($)',
        data: avgs,
        backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderRadius: 4,
        maxBarThickness: 64,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `$${ctx.parsed.x.toFixed(2)}` } },
      },
      scales: {
        x: { beginAtZero: true, ticks: { callback: v => '$' + v } },
        y: { grid: { display: false } },
      },
    },
  });
}

// ── 4. Fare vs Distance Scatter ─────────────────────────────
export function renderScatter() {
  const rows = state.fareVsDistance;
  if (!rows || !rows.length) return;

  const points = rows
    .filter(r => r.trip_distance > 0 && r.fare_amount > 0 && r.trip_distance < 50 && r.fare_amount < 200)
    .map(r => ({ x: r.trip_distance, y: r.fare_amount }));

  destroyChart('scatter');
  charts.scatter = new Chart(document.getElementById('chartScatter'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Trip',
        data: points,
        backgroundColor: 'rgba(108,99,255,0.35)',
        pointRadius: 2.5,
        pointHoverRadius: 5,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.x.toFixed(1)} mi — $${ctx.parsed.y.toFixed(2)}` } },
      },
      scales: {
        x: { title: { display: true, text: 'Distance (mi)' }, beginAtZero: true },
        y: { title: { display: true, text: 'Total Fare ($)' }, beginAtZero: true },
      },
    },
  });
}

// ── 5. Top 10 Pickup Zones ──────────────────────────────────
export function renderTopZones() {
  const rows = state.topPickupZones;
  if (!rows || !rows.length) return;
  const labels = rows.map(r => r.zone_name);
  const data = rows.map(r => r.pickup_count);

  destroyChart('topZones');
  charts.topZones = new Chart(document.getElementById('chartTopZones'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Pickups',
        data,
        backgroundColor: labels.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
        borderRadius: 4,
        maxBarThickness: 40,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.x.toLocaleString()} pickups` } },
      },
      scales: {
        x: { beginAtZero: true, ticks: { callback: v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v } },
        y: { grid: { display: false } },
      },
    },
  });
}
