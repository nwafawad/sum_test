import { state } from './state.js';

// ── Leaflet Heatmap ─────────────────────────────────────────

function getColor(value, maxVal) {
  if (!value) return '#1a1d27';
  const ratio = Math.min(value / maxVal, 1);
  const stops = [
    [26, 29, 39],
    [108, 99, 255],
    [0, 201, 167],
    [255, 217, 61],
    [255, 107, 107],
  ];
  const segment = ratio * (stops.length - 1);
  const i = Math.min(Math.floor(segment), stops.length - 2);
  const t = segment - i;
  const r = Math.round(stops[i][0] + t * (stops[i + 1][0] - stops[i][0]));
  const g = Math.round(stops[i][1] + t * (stops[i + 1][1] - stops[i][1]));
  const b = Math.round(stops[i][2] + t * (stops[i + 1][2] - stops[i][2]));
  return `rgb(${r},${g},${b})`;
}

export function renderMap() {
  const metric = document.getElementById('mapMetric').value;
  const geo = state.geojson;
  if (!geo) return;

  // Build metric values from GeoJSON properties (stats embedded by API)
  const metricValues = {};
  geo.features.forEach(f => {
    const p = f.properties;
    const id = p.zone_id || p.LocationID;
    if (id == null) return;
    if (metric === 'count') metricValues[id] = p.pickup_count || 0;
    else if (metric === 'fare') metricValues[id] = p.avg_fare || 0;
    else metricValues[id] = p.avg_distance || 0;
  });

  const vals = Object.values(metricValues).filter(v => v > 0);
  const maxVal = vals.length ? Math.max(...vals) : 1;

  // Init map once
  if (!state.leafletMap) {
    state.leafletMap = L.map('map', {
      center: [40.735, -73.94],
      zoom: 11,
      zoomControl: true,
      attributionControl: true,
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 18,
    }).addTo(state.leafletMap);
  }

  // Remove old layer
  if (state.geoLayer) {
    state.leafletMap.removeLayer(state.geoLayer);
    state.geoLayer = null;
  }

  if (!geo) return;

  state.geoLayer = L.geoJSON(geo, {
    style: (feature) => {
      const id = feature.properties.zone_id || feature.properties.LocationID;
      const val = metricValues[id] || 0;
      return { fillColor: getColor(val, maxVal), fillOpacity: 0.75, color: '#2e3345', weight: 1 };
    },
    onEachFeature: (feature, layer) => {
      const p = feature.properties;

      layer.bindTooltip(`
        <div class="info-panel">
          <h4>${p.zone_name || p.zone || p.Zone || 'Unknown Zone'}</h4>
          <div><strong>Borough:</strong> ${p.borough || p.Borough || '—'}</div>
          <div><strong>Pickups:</strong> ${(p.pickup_count || 0).toLocaleString()}</div>
          <div><strong>Avg Fare:</strong> $${(p.avg_fare || 0).toFixed(2)}</div>
          <div><strong>Avg Distance:</strong> ${(p.avg_distance || 0).toFixed(2)} mi</div>
        </div>
      `, { sticky: true, className: '' });

      layer.on('mouseover', function () { this.setStyle({ weight: 2, color: '#6c63ff', fillOpacity: 0.9 }); });
      layer.on('mouseout', function () { state.geoLayer.resetStyle(this); });
    },
  }).addTo(state.leafletMap);

  // Legend
  if (!state.leafletMap._legendCtrl) {
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'map-legend');
      div.id = 'mapLegend';
      return div;
    };
    legend.addTo(state.leafletMap);
    state.leafletMap._legendCtrl = legend;
  }

  const metricLabels = { count: 'Pickup Count', fare: 'Avg Fare ($)', distance: 'Avg Distance (mi)' };
  const legendEl = document.getElementById('mapLegend');
  if (legendEl) {
    const steps = 5;
    let html = `<strong>${metricLabels[metric]}</strong><br>`;
    for (let i = 0; i <= steps; i++) {
      const v = (maxVal / steps) * i;
      const label = metric === 'fare' ? '$' + v.toFixed(0) : metric === 'distance' ? v.toFixed(1) + ' mi' : v.toFixed(0);
      html += `<i style="background:${getColor(v, maxVal)}"></i> ${label}<br>`;
    }
    legendEl.innerHTML = html;
  }
}

// ── Bind map metric dropdown ──────────────────────────────
export function bindMapEvents() {
  document.getElementById('mapMetric').addEventListener('change', renderMap);
}
