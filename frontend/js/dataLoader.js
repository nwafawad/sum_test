// ── Fetch JSON from an API endpoint ──────────────────────
export async function fetchAPI(endpoint) {
  const res = await fetch(endpoint);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${endpoint}`);
  return res.json();
}

// ── Hide the loading overlay ──────────────────────────────
export function hideLoading() {
  const el = document.getElementById('loadingOverlay');
  el.classList.add('hidden');
  setTimeout(() => { el.style.display = 'none'; }, 500);
}
