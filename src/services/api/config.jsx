// In development the API is normally exposed on port 8000.  In production,
// Caddy serves the frontend and proxies this same-origin path to the private
// API container, so the API port is never published to the Internet.
const defaultApiBase = import.meta.env.DEV
  ? `${window.location.protocol}//${window.location.hostname}:8000`
  : "/api";

export const API_BASE = (
  import.meta.env.VITE_API_URL || defaultApiBase
).replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
