const PREFIX = "technomarket:";

function safeJsonParse(value, fallback) {
  try {
    if (value == null) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function readStorage(key, fallback) {
  const raw = localStorage.getItem(PREFIX + key);
  return safeJsonParse(raw, fallback);
}

export function writeStorage(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeStorage(key) {
  localStorage.removeItem(PREFIX + key);
}

export function subscribeStorage(handler) {
  const onStorage = (e) => {
    if (!e.key || !e.key.startsWith(PREFIX)) return;
    handler(e.key.slice(PREFIX.length));
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

