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
  
  const iconSpan = document.createElement('span');
  iconSpan.className = 'material-symbols-outlined toast__icon filled';
  iconSpan.style.fontSize = '20px';
  iconSpan.textContent = iconName;
  
  const messageSpan = document.createElement('span');
  messageSpan.textContent = message;
  
  toast.appendChild(iconSpan);
  toast.appendChild(messageSpan);

  container.appendChild(toast);

  // Auto-remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
