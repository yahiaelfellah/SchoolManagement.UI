// Simple client-side auth helper for demo purposes
// Use localStorage to persist a token flag. Replace with real auth in production.
const STORAGE_KEY = "vsud_auth_token";

export function isAuthenticated() {
  return !!localStorage.getItem(STORAGE_KEY);
}

export function login(token = "token") {
  localStorage.setItem(STORAGE_KEY, token);
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY);
}

export default { isAuthenticated, login, logout };
