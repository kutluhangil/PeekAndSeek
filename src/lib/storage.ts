const memoryStorage = new Map<string, string>();

function hasBrowserStorage() {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

export function getStoredItem(key: string) {
  if (hasBrowserStorage()) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return memoryStorage.get(key) ?? null;
    }
  }

  return memoryStorage.get(key) ?? null;
}

export function setStoredItem(key: string, value: string) {
  memoryStorage.set(key, value);

  if (!hasBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Fall back to in-memory storage when persistent storage is unavailable.
  }
}

export function removeStoredItem(key: string) {
  memoryStorage.delete(key);

  if (!hasBrowserStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors and keep the session alive.
  }
}
