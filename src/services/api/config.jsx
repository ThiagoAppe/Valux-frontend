const defaultApiBase = `${window.location.protocol}//${window.location.hostname}:8000`;

export const API_BASE = (
  import.meta.env.VITE_API_URL || defaultApiBase
).replace(/\/$/, "");

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
