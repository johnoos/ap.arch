// controllerNavHandler.js
import { openPdfViewer } from './pdfViewer.js';
import { loadFragment } from './fragmentLoader.js';
import { showSpinner, hideSpinner } from './utils.js';
import { toggleSidebar, closeSidebarIfClickedOutside } from './sidebar.js';
import { setupHistory } from './historyManager.js';

window.toggleMenu = toggleSidebar;

document.addEventListener('DOMContentLoaded', () => {
  const mainStage = document.getElementById('content-panel-container');
  const navRoot = document.querySelector('.navig-rail-container__list');
  const allBtns = document.querySelectorAll('button[data-category]');

  closeSidebarIfClickedOutside();
  setupHistory(allBtns);

  // Sidebar click
  navRoot?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-category]');
    if (!btn) return;

    // 1. UI Feedback: Update Active State
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // 2. Data Load: Fetch the fragment
    loadFragment(`/fragments/galleries/${btn.dataset.category}.html`);

    // 3. UX: Close Sidebar on Mobile
    // Get the actual sidebar element (id from our new CSS)
    const sidebarContainer = document.getElementById('navig-rail-container');
  
    if (window.innerWidth < 768 && sidebarContainer) {
      // Only use ONE class name consistently across CSS and JS
      sidebarContainer.classList.remove('open'); 
    
      // Optional: If you use a 'menu-overlay' to dim the background, close it too
      document.getElementById('menu-overlay')?.classList.remove('active');
    }
  
  });

  // controllerNavHandler.js - Refactored Main Stage Listener
  mainStage?.addEventListener('click', (e) => {
    // 1. Check for PDF View Buttons
    // Look for the class we used in Region 4: .btn-view
    const viewBtn = e.target.closest('.btn-view'); 
  
    if (viewBtn) {
      const { url, title } = viewBtn.dataset;
      if (url) {
        showSpinner();
        openPdfViewer(url, title);
        return;
      }
    }

    // 2. Check for Download Buttons (If you want JS to handle these too)
    const downloadBtn = e.target.closest('.btn-download');
    if (downloadBtn) return;
  });
  // At the bottom of your DOMContentLoaded block
  const pdfViewer = document.querySelector('.pdf-viewer-container');

  pdfViewer?.addEventListener('click', (e) => {
    // Check if they clicked the close button specifically
    if (e.target.closest('.btn-close-viewer')) {
      import('./pdfViewer.js').then(m => m.closePdfViewer());
    }
  });
});