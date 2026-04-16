/**
 * router.js — Hash-based SPA Router
 * Handles page transitions with animated crossfade
 */

import { store } from './state.js';

const routes = {};
let currentCleanup = null;

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  if (window.location.hash === `#${path}`) {
    // Force re-render even if same path
    renderRoute(path);
    return;
  }
  window.location.hash = path;
}

async function renderRoute(path) {
  const renderFn = routes[path] || routes['overview'];
  const container = document.getElementById('page-container');
  if (!container || !renderFn) return;

  // Cleanup previous page
  if (currentCleanup) {
    try { currentCleanup(); } catch (e) { console.error('Cleanup error:', e); }
    currentCleanup = null;
  }

  // Animate out
  container.classList.add('page-exit');
  await new Promise(r => setTimeout(r, 180));

  // Clear and render new page
  container.innerHTML = '';
  container.classList.remove('page-exit');
  container.classList.add('page-enter');

  const cleanup = await renderFn(container);
  if (typeof cleanup === 'function') {
    currentCleanup = cleanup;
  }

  // Update state
  store.set('currentPage', path);

  // Remove animation class after it completes
  setTimeout(() => {
    container.classList.remove('page-enter');
  }, 400);
}

export function initRouter() {
  function onHashChange() {
    const hash = window.location.hash.replace('#', '') || 'overview';
    renderRoute(hash);
  }

  window.addEventListener('hashchange', onHashChange);

  // Initial route
  const initial = window.location.hash.replace('#', '') || 'overview';
  window.location.hash = initial;
  // Small delay to ensure DOM is ready
  requestAnimationFrame(() => renderRoute(initial));
}
