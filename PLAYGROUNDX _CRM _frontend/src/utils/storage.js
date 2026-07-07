// src/utils/storage.js

const PREFIX = 'pgx_';
const VERSION_KEY = 'pgx_database_version';
const CURRENT_VERSION = '1.2.0';

export function getPrefixedKey(key) {
  if (key.startsWith(PREFIX)) return key;
  return PREFIX + key;
}

export function loadData(key) {
  try {
    const data = localStorage.getItem(getPrefixedKey(key));
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Error loading data from localStorage', err);
    return null;
  }
}

export function saveData(key, value) {
  try {
    localStorage.setItem(getPrefixedKey(key), JSON.stringify(value));
  } catch (err) {
    console.error('Error saving data to localStorage', err);
  }
}

export function removeData(key) {
  localStorage.removeItem(getPrefixedKey(key));
}

// Clears only application data (keys starting with pgx_), preserving other localStorage items
export function clearData() {
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      keysToRemove.push(k);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

export function checkVersionAndMigrate() {
  const storedVersion = localStorage.getItem(VERSION_KEY);
  if (!storedVersion || storedVersion !== CURRENT_VERSION) {
    console.warn(`Version mismatch. Expected ${CURRENT_VERSION}, found ${storedVersion}. Resetting database...`);
    resetDatabase();
  }
}

export function resetDatabase() {
  // Clear everything pgx_ related, but maybe keep UI state if we wanted to. 
  // For a full reset, we wipe all pgx_ keys.
  clearData();
  localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  // Re-seeding will happen naturally as contexts mount, 
  // but we can trigger a reload to ensure fresh state.
  window.location.reload();
}
