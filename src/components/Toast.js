/**
 * Toast.js — Animated Toast Notification System
 */

/**
 * Show a toast notification
 * @param {string} message
 * @param {'info'|'success'|'error'} type
 */
export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeClass = type === 'success' ? 'toast--success' : type === 'error' ? 'toast--error' : '';

  let iconName = 'info';
  if (type === 'success') iconName = 'check_circle';
  if (type === 'error') iconName = 'error';

  toast.className = `toast ${typeClass}`;
  toast.innerHTML = `
    <span class="material-symbols-outlined toast__icon filled" style="font-size: 20px;">${iconName}</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
