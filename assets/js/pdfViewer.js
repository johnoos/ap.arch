import { hideSpinner } from './utils.js';

export function openPdfViewer(url, title) {
  // 1. Get the Shell (The Structural Container from Region 5)
  const viewerContainer = document.querySelector('.pdf-viewer-container');
  const iframe = viewerContainer?.querySelector('iframe');
  const titleDisplay = viewerContainer?.querySelector('.viewer-title');

  if (!viewerContainer || !iframe) {
    console.error("PDF Viewer structure not found in DOM");
    hideSpinner();
    return;
  }

  // 2. Set the Content (The Skin/Data)
  iframe.src = url;
  if (titleDisplay) titleDisplay.textContent = title || 'Document Viewer';

  // 3. Activate the Structure (Triggers display: flex !important)
  viewerContainer.classList.add('active');

  // 4. Cleanup UX
  // Hide spinner once the iframe has at least started communicating
  iframe.onload = () => {
    hideSpinner();
  };

  // 5. Handle the Close Button
  const closeBtn = viewerContainer.querySelector('.btn-close-viewer');
  closeBtn?.addEventListener('click', closePdfViewer, { once: true });
  };

export function closePdfViewer() {
  const viewerContainer = document.querySelector('.pdf-viewer-container');
  const iframe = viewerContainer?.querySelector('iframe');

  if (viewerContainer) {
    viewerContainer.classList.remove('active'); // Back to display: none
    if (iframe) iframe.src = ''; // Kill the stream to save memory
  }
}