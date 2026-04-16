/**
 * Sidebar.js — Shared Navigation Sidebar Component
 */

import { store } from '../state.js';
import { navigate } from '../router.js';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'enhance', label: 'Enhancement', icon: 'auto_awesome' },
  { id: 'studio', label: 'Studio', icon: 'mic_external_on' },
];

const FOOTER_ITEMS = [
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'help', label: 'Help & Support', icon: 'help_outline' },
];

export function renderSidebar(container) {
  const currentPage = store.get('currentPage') || 'overview';

  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.id = 'main-sidebar';

  aside.innerHTML = `
    <div class="sidebar__brand">
      <div class="sidebar__logo">
        <span class="material-symbols-outlined">graphic_eq</span>
      </div>
      <div>
        <div class="sidebar__title">The Sonic Editorial</div>
        <div class="sidebar__subtitle">Precision Engine v3.2</div>
      </div>
    </div>

    <nav class="sidebar__nav">
      <div class="sidebar__section-label">Main</div>
      ${NAV_ITEMS.map(item => `
        <div class="sidebar__item ${item.id === currentPage ? 'active' : ''}" data-page="${item.id}" id="nav-${item.id}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span>${item.label}</span>
        </div>
      `).join('')}
    </nav>

    <div class="sidebar__footer">
      ${FOOTER_ITEMS.map(item => `
        <div class="sidebar__item" data-page="${item.id}">
          <span class="material-symbols-outlined">${item.icon}</span>
          <span>${item.label}</span>
        </div>
      `).join('')}

      <button class="btn btn--primary btn--full" style="margin-top: 0.75rem; border-radius: var(--radius-md);" id="new-production-btn">
        <span class="material-symbols-outlined" style="font-size: 18px;">add</span>
        <span class="btn__text">New Production</span>
      </button>
    </div>
  `;

  container.prepend(aside);

  // Event listeners
  aside.querySelectorAll('.sidebar__item[data-page]').forEach(item => {
    item.addEventListener('click', () => {
      const page = item.dataset.page;
      if (['overview', 'enhance', 'studio'].includes(page)) {
        navigate(page);
      }
    });
  });

  // New Production → go to enhance
  const newBtn = aside.querySelector('#new-production-btn');
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      store.update({ rawScript: '', enhancedScript: '', uploadedFilename: '' });
      navigate('enhance');
    });
  }

  // Listen for page changes to update active state
  const unsub = store.on('currentPage', (page) => {
    aside.querySelectorAll('.sidebar__item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === page);
    });
  });

  return unsub;
}
