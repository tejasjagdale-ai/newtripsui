/**
 * Navbar.js — Shared Top Navigation Bar
 */

import { store } from '../state.js';
import { navigate } from '../router.js';

const TABS = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'enhance', label: 'Workspace' },
  { id: 'studio', label: 'Studio' },
];

export function renderNavbar(container) {
  const currentPage = store.get('currentPage') || 'overview';

  const nav = document.createElement('header');
  nav.className = 'navbar';
  nav.id = 'main-navbar';

  nav.innerHTML = `
    <nav class="navbar__tabs">
      ${TABS.map(tab => `
        <div class="navbar__tab ${tab.id === currentPage ? 'active' : ''}" data-tab="${tab.id}" id="tab-${tab.id}">
          ${tab.label}
        </div>
      `).join('')}
    </nav>

    <div class="navbar__actions">
      <button class="btn btn--primary btn--pill" id="navbar-generate-btn" style="padding: 0.5rem 1.25rem;">
        <span class="material-symbols-outlined" style="font-size: 16px;">waves</span>
        <span class="btn__text">Generate Speech</span>
      </button>
      <button class="navbar__icon-btn" title="Notifications">
        <span class="material-symbols-outlined">notifications</span>
      </button>
      <button class="navbar__icon-btn" title="Settings">
        <span class="material-symbols-outlined">settings</span>
      </button>
      <div class="navbar__avatar" title="Profile">SE</div>
    </div>
  `;

  container.prepend(nav);

  // Tab click handlers
  nav.querySelectorAll('.navbar__tab').forEach(tab => {
    tab.addEventListener('click', () => {
      navigate(tab.dataset.tab);
    });
  });

  // Generate Speech button → go to studio
  const genBtn = nav.querySelector('#navbar-generate-btn');
  if (genBtn) {
    genBtn.addEventListener('click', () => navigate('studio'));
    // Set initial visibility based on current page
    genBtn.style.display = currentPage === 'studio' ? 'none' : 'flex';
  }

  // Listen for page changes
  const unsub = store.on('currentPage', (page) => {
    nav.querySelectorAll('.navbar__tab').forEach(el => {
      el.classList.toggle('active', el.dataset.tab === page);
    });
    
    if (genBtn) {
      genBtn.style.display = page === 'studio' ? 'none' : 'flex';
    }
  });

  return unsub;
}
