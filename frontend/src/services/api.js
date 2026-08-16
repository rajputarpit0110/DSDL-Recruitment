import axios from 'axios';

// VITE_API_URL must point to the backend root WITH /api suffix.
// e.g. https://dsdl-recruitment-backend-3.onrender.com/api
//
// Guard: if the env var is set to the bare origin (without /api), append it
// automatically so requests always resolve to the correct path.
const rawEnvUrl = import.meta.env.VITE_API_URL;
const API_BASE_URL = rawEnvUrl
  ? rawEnvUrl.replace(/\/+$/, '').endsWith('/api')
    ? rawEnvUrl.replace(/\/+$/, '')          // already has /api — just strip trailing slash
    : rawEnvUrl.replace(/\/+$/, '') + '/api' // bare origin — append /api
  : '/api'; // no env var set — fall back to Vite dev-server proxy

// Build-time log: visible in browser DevTools → Console on every page load.
// Remove this line once production URLs are confirmed working.
console.log('[DSDL] API base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Enables HttpOnly cookie transmission (localhost)
  headers: {
    'Content-Type': 'application/json'
  }
});

// ─── Token-based auth for cross-origin production deployments ─────────────────
// Frontend (dsdl-recruitment1.onrender.com) and backend (dsdl-recruitment-backend-3.onrender.com)
// are cross-origin. Modern browsers block cross-site cookies even with SameSite=None.
// Solution: store the JWT returned in the login response body in sessionStorage
// and attach it as Authorization: Bearer on every request.
// The backend auth middleware already accepts both cookies AND Authorization header.

export function setAuthToken(token) {
  if (token) {
    sessionStorage.setItem('dsdl_admin_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    sessionStorage.removeItem('dsdl_admin_token');
    delete api.defaults.headers.common['Authorization'];
  }
}

// On module load — restore token from sessionStorage so page refresh works.
// This runs before App.jsx mounts, so checkAuth() on /admin/me will have the header ready.
const _savedToken = sessionStorage.getItem('dsdl_admin_token');
if (_savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${_savedToken}`;
}

// ─────────────────────────────────────────────────────────────────────────────

// Response Interceptor — differentiate error types for meaningful user messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // No response means browser blocked the request (CORS, server offline, network failure)
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "We couldn't connect to the registration server. Please try again in a moment.",
        data: null
      });
    }

    const status = error.response.status;
    const serverMessage = error.response?.data?.message;

    let message;
    if (status === 409) {
      message = serverMessage || 'You have already registered using this roll number or college email.';
    } else if (status === 400) {
      message = serverMessage || 'Please check your inputs and try again.';
    } else if (status === 429) {
      message = 'Too many requests. Please wait a few minutes and try again.';
    } else if (status === 503) {
      message = serverMessage || 'Registration service is temporarily unavailable. Please try again in a moment.';
    } else if (status >= 500) {
      message = 'Something went wrong while submitting your application. Please try again.';
    } else {
      message = serverMessage || 'Registration failed. Please try again.';
    }

    return Promise.reject({ status, message, data: error.response?.data });
  }
);

export default api;

