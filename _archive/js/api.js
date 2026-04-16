/**
 * api.js
 * Centralized API utility for communicating with the FastAPI backend.
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Helper to show toast notifications
 */
export function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Add icon based on type
    let icon = '';
    if (type === 'error') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;
    } else if (type === 'success') {
        icon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    }

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease-in reverse forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Handle API Errors uniformly
 */
async function handleResponse(response) {
    if (!response.ok) {
        let errorMessage = 'An error occurred';
        try {
            const errData = await response.json();
            errorMessage = errData.detail || errData.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText;
        }
        showToast(errorMessage, 'error');
        throw new Error(errorMessage);
    }
    return response;
}

/**
 * Upload a document (.txt or .docx)
 * @param {File} file 
 * @returns {Promise<Object>} Contains the extracted text
 */
export async function uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
    });

    const res = await handleResponse(response);
    return res.json();
}

/**
 * Enhance the script using Gemini AI
 * @param {string} text 
 * @param {boolean} autoPacing 
 * @param {boolean} toneMarkers 
 * @returns {Promise<Object>} Contains enhanced_text
 */
export async function enhanceScript(text, autoPacing = true, toneMarkers = true) {
    const response = await fetch(`${API_BASE_URL}/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text,
            options: { auto_pacing: autoPacing, tone_markers: toneMarkers }
        })
    });

    const res = await handleResponse(response);
    return res.json();
}

/**
 * Generate TTS Audio
 * @param {string} text 
 * @param {string} voice 
 * @returns {Promise<Blob>} The WAV audio blob
 */
export async function generateTTS(text, voice) {
    const response = await fetch(`${API_BASE_URL}/tts/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice })
    });

    const res = await handleResponse(response);
    return res.blob();
}
