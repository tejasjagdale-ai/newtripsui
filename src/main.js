/**
 * main.js — Application Entry Point
 * Initializes the SPA shell with sidebar, navbar, and router
 */

import { renderSidebar } from './components/Sidebar.js';
import { renderNavbar } from './components/Navbar.js';
import { registerRoute, initRouter } from './router.js';
import { renderOverviewPage } from './pages/OverviewPage.js';
import { renderEnhancePage } from './pages/EnhancePage.js';
import { renderStudioPage } from './pages/StudioPage.js';

function init() {
  const app = document.getElementById('app');
  if (!app) return;

  // Build the app shell
  app.innerHTML = '';
  app.className = 'app-layout';

  // Render sidebar (left)
  renderSidebar(app);

  // Create main area
  const mainArea = document.createElement('div');
  mainArea.className = 'main-area';
  app.appendChild(mainArea);

  // Render navbar (top of main area)
  renderNavbar(mainArea);

  // Create page container (where pages render into)
  const pageContainer = document.createElement('div');
  pageContainer.id = 'page-container';
  pageContainer.style.cssText = 'flex: 1; overflow: hidden; display: flex; flex-direction: column;';
  mainArea.appendChild(pageContainer);

  // Register routes
  registerRoute('overview', renderOverviewPage);
  registerRoute('enhance', renderEnhancePage);
  registerRoute('studio', renderStudioPage);

  // Start router
  initRouter();
}

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
