/**
 * api.js — Backend API Client
 * Communicates with the FastAPI backend via Vite proxy
 */

import { showToast } from '../components/Toast.js';

const API_BASE = '/api';

/**
 * Generic error handler for API responses
 */
async function handleResponse(response) {
  if (!response.ok) {
    let message = 'An unexpected error occurred';
    try {
      const data = await response.json();
      message = data.detail || data.error || message;
    } catch {
      message = response.statusText || message;
    }
    showToast(message, 'error');
    throw new Error(message);
  }
  return response;
}

/**
 * Upload a .txt or .docx file for text extraction
 * @param {File} file
 * @returns {Promise<{text: string, word_count: number, char_count: number, filename: string}>}
 */
export async function uploadDocument(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    });

    const res = await handleResponse(response);
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      showToast('Cannot connect to server. Is the backend running?', 'error');
    }
    throw err;
  }
}

/**
 * Enhance script text using Gemini AI
 * @param {string} text
 * @param {boolean} autoPacing
 * @param {boolean} toneMarkers
 * @returns {Promise<{enhanced_text: string, tone_analysis: string, estimated_duration: string, word_count: number, char_count: number, clarity_score: number, engagement_score: number, sentiment: object}>}
 */
export async function enhanceScript(text, autoPacing = true, toneMarkers = true) {
  try {
    const response = await fetch(`${API_BASE}/enhance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        options: {
          auto_pacing: autoPacing,
          tone_markers: toneMarkers,
        },
      }),
    });

    const res = await handleResponse(response);
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      showToast('Cannot connect to server. Is the backend running?', 'error');
    }
    throw err;
  }
}

/**
 * Generate TTS audio from text
 * @param {string} text
 * @param {string} voice
 * @returns {Promise<Blob>} WAV audio blob
 */
export async function generateTTS(text, voice) {
  try {
    const response = await fetch(`${API_BASE}/tts/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice }),
    });

    const res = await handleResponse(response);
    return res.blob();
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      showToast('Cannot connect to server. Is the backend running?', 'error');
    }
    throw err;
  }
}

/**
 * Check backend health
 * @returns {Promise<{status: string, version: string, api_key_configured: boolean}>}
 */
export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    const res = await handleResponse(response);
    return res.json();
  } catch (err) {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) {
      showToast('Cannot connect to backend health check. Is the backend running?', 'error');
    }
    throw err;
  }
}
