export function getStorage(key, fallback = null) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch {
    return fallback;
  }
}

export function setStorage(key, value) {
  try { localStorage.setItem(key, value); } catch {}
}

export function removeStorage(key) {
  try { localStorage.removeItem(key); } catch {}
}

export function getSessionStorage(key, fallback = '') {
  try { return sessionStorage.getItem(key) || fallback; } catch { return fallback; }
}

export function setSessionStorage(key, value) {
  try { sessionStorage.setItem(key, value); } catch {}
}
