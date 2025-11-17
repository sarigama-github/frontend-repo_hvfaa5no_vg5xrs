const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const getToken = () => localStorage.getItem('token');
export const setToken = (t) => localStorage.setItem('token', t);
export const clearToken = () => localStorage.removeItem('token');

export async function api(path, { method = 'GET', body, headers = {}, auth = false } = {}) {
  const opts = { method, headers: { 'Content-Type': 'application/json', ...headers } };
  if (body) opts.body = JSON.stringify(body);
  if (auth) {
    const t = getToken();
    if (t) opts.headers['Authorization'] = `Bearer ${t}`;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    let msg = 'Request failed';
    try { const j = await res.json(); msg = j.detail || j.message || msg; } catch (_) {}
    throw new Error(msg);
  }
  return res.json();
}

export { API_BASE };