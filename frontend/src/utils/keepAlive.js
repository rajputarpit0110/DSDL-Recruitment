/**
 * keepAlive.js
 * Sends a lightweight GET /api/health ping every 10 minutes so the
 * Render free-tier backend does not spin down due to inactivity.
 */

const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
const rawEnvUrl = import.meta.env.VITE_API_URL;
const API_BASE = rawEnvUrl
  ? rawEnvUrl.replace(/\/+$/, '').endsWith('/api')
    ? rawEnvUrl.replace(/\/+$/, '')
    : rawEnvUrl.replace(/\/+$/, '') + '/api'
  : '/api';

async function pingServer() {
  try {
    await fetch(`${API_BASE}/health`, { method: 'GET', credentials: 'include' });
    console.log('[KeepAlive] Server pinged at', new Date().toLocaleTimeString('en-IN'));
  } catch {
    // Silent fail — network might be down momentarily, next interval will retry
  }
}

let _intervalId = null;

/**
 * Start the keep-alive background pinger.
 * Safe to call multiple times — will not start duplicate intervals.
 */
export function startKeepAlive() {
  if (_intervalId !== null) return; // Already running
  // Delay first ping by 2 minutes so it doesn't compete with initial page load
  setTimeout(() => {
    pingServer();
    _intervalId = setInterval(pingServer, PING_INTERVAL_MS);
  }, 2 * 60 * 1000);
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
