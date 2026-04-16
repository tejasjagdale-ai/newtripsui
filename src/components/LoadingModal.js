/**
 * LoadingModal.js — Centered loading popup with animated waveform
 */

export function showLoadingModal(title, description) {
  // Remove any existing modal
  hideLoadingModal();

  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-modal-overlay';

  overlay.innerHTML = `
    <div class="loading-modal">
      <div class="loading-modal__icon">
        <div class="loading-modal__spinner"></div>
      </div>
      <div class="loading-modal__title">${title}</div>
      <div class="loading-modal__desc">${description}</div>
      <div class="loading-modal__wave">
        ${Array.from({ length: 8 }, () => `<span class="wave-bar" style="height: 20px; width: 3px;"></span>`).join('')}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
}

export function hideLoadingModal() {
  const existing = document.getElementById('loading-modal-overlay');
  if (existing) {
    existing.style.opacity = '0';
    existing.style.transition = 'opacity 200ms ease';
    setTimeout(() => existing.remove(), 200);
  }
}
