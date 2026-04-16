/**
 * state.js — Centralized Reactive State Store
 * Pub/sub pattern with sessionStorage persistence
 */

const STORAGE_KEY = 'sonic_editorial_state';

const defaultState = {
  currentPage: 'overview',
  rawScript: '',
  enhancedScript: '',
  toneAnalysis: '',
  estimatedDuration: '',
  wordCount: 0,
  charCount: 0,
  selectedVoice: 'Puck',
  audioBlob: null,
  audioBlobUrl: null,
  isUploading: false,
  isEnhancing: false,
  isGenerating: false,
  uploadedFilename: '',
};

class Store {
  constructor() {
    this._state = { ...defaultState };
    this._listeners = new Map();
    this._restore();
  }

  get(key) {
    return this._state[key];
  }

  getAll() {
    return { ...this._state };
  }

  set(key, value) {
    const old = this._state[key];
    if (old === value) return;
    this._state[key] = value;
    this._persist();
    this._notify(key, value, old);
  }

  update(partial) {
    const changes = [];
    for (const [key, value] of Object.entries(partial)) {
      const old = this._state[key];
      if (old !== value) {
        this._state[key] = value;
        changes.push([key, value, old]);
      }
    }
    if (changes.length > 0) {
      this._persist();
      for (const [key, value, old] of changes) {
        this._notify(key, value, old);
      }
    }
  }

  on(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);
    return () => this._listeners.get(key)?.delete(callback);
  }

  _notify(key, value, old) {
    const listeners = this._listeners.get(key);
    if (listeners) {
      for (const cb of listeners) {
        try { cb(value, old); } catch (e) { console.error('State listener error:', e); }
      }
    }
    // Also notify wildcard listeners
    const wildcards = this._listeners.get('*');
    if (wildcards) {
      for (const cb of wildcards) {
        try { cb(key, value, old); } catch (e) { console.error('State listener error:', e); }
      }
    }
  }

  _persist() {
    try {
      const serializable = { ...this._state };
      // Don't persist blobs
      delete serializable.audioBlob;
      delete serializable.audioBlobUrl;
      delete serializable.isUploading;
      delete serializable.isEnhancing;
      delete serializable.isGenerating;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      // SessionStorage might be full or unavailable
    }
  }

  _restore() {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(this._state, parsed);
      }
    } catch (e) {
      // Ignore parse errors
    }
  }

  reset() {
    this._state = { ...defaultState };
    sessionStorage.removeItem(STORAGE_KEY);
  }
}

export const store = new Store();
