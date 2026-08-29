/**
 * keepAlive.js
 * Sends a lightweight GET /api/health ping every 10 minutes so the
 * Render free-tier backend does not spin down due to inactivity.
 */

const PING_INTERVAL_MS = 8 * 60 * 1000; // 8 minutes (Render sleeps after 15 min inactivity)
const rawEnvUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawEnvUrl
  ? rawEnvUrl.replace(/\/+$/, '').endsWith('/api')
    ? rawEnvUrl.replace(/\/+$/, '')
    : rawEnvUrl.replace(/\/+$/, '') + '/api'
  : '/api';

async function pingServer() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET', credentials: 'include' });
    if (res.ok) {
      console.log('[KeepAlive] Backend ping successful at', new Date().toLocaleTimeString('en-IN'));
    }
  } catch (err) {
    // Silent fail — network might be down momentarily or server waking up
    console.warn('[KeepAlive] Ping failed or waking up:', err.message);
  }
}

let _intervalId = null;

/**
 * Start the keep-alive background pinger.
 * Fires IMMEDIATELY on page load to wake up a sleeping backend,
 * then repeats every 8 minutes while the tab remains open.
 */
export function startKeepAlive() {
  if (_intervalId !== null) return; // Already running

  // Ping immediately upon opening the website to wake up backend immediately
  pingServer();

  // Then schedule recurring ping every 8 minutes
  _intervalId = setInterval(pingServer, PING_INTERVAL_MS);
}

/**
 * Stop the keep-alive pinger (useful for tests or cleanup).
 */
export function stopKeepAlive() {
  if (_intervalId !== null) {
    clearInterval(_intervalId);
    _intervalId = null;
  }
}
