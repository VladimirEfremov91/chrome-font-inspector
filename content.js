let labels = [];
let active = false;
let refreshScheduled = false;

function scheduleRefresh() {
  if (!active) return;
  if (refreshScheduled) return;
  refreshScheduled = true;

  window.requestAnimationFrame(() => {
    refreshScheduled = false;
    if (!active) return;
    showFontSizes();
  });
}

function isStyleVisible(el) {
  const style = window.getComputedStyle(el);
  if (style.display === 'none') return false;
  if (style.visibility === 'hidden') return false;
  if (Number(style.opacity) === 0) return false;
  return true;
}

function rectIntersectsViewport(rect) {
  if (rect.width <= 0 || rect.height <= 0) return false;
  if (rect.bottom <= 0 || rect.right <= 0) return false;
  if (rect.top >= window.innerHeight || rect.left >= window.innerWidth) return false;
  return true;
}

function clampPointToViewport(x, y) {
  const clampedX = Math.min(Math.max(x, 0), Math.max(0, window.innerWidth - 1));
  const clampedY = Math.min(Math.max(y, 0), Math.max(0, window.innerHeight - 1));
  return { x: clampedX, y: clampedY };
}

function isOnTopAtAnyPoint(el) {
  const rects = el.getClientRects();
  if (!rects || rects.length === 0) return false;

  for (const rect of rects) {
    if (!rectIntersectsViewport(rect)) continue;

    const points = [
      { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
      { x: rect.left + 1, y: rect.top + 1 },
      { x: rect.right - 1, y: rect.top + 1 },
      { x: rect.left + 1, y: rect.bottom - 1 },
      { x: rect.right - 1, y: rect.bottom - 1 }
    ];

    for (const pt of points) {
      const { x, y } = clampPointToViewport(pt.x, pt.y);
      const topEl = document.elementFromPoint(x, y);
      if (!topEl) continue;
      if (el === topEl || el.contains(topEl)) return true;
    }
  }

  return false;
}

function getVisibleTextElements() {
  const allElements = document.querySelectorAll('body *');
  const textElements = [];

  for (const el of allElements) {
    // 1) Fast style visibility checks
    if (!isStyleVisible(el)) continue;
    
    // 2) Check if element has direct text content (ignore empty containers)
    let hasDirectText = false;
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        hasDirectText = true;
        break;
      }
    }

    if (!hasDirectText) continue;

    // 3) Must intersect viewport, and must not be fully covered (e.g. behind a modal)
    const rect = el.getBoundingClientRect();
    if (!rectIntersectsViewport(rect)) continue;
    if (!isOnTopAtAnyPoint(el)) continue;

    textElements.push(el);
  }
  return textElements;
}

function showFontSizes() {
  // Clean up any existing labels first
  hideFontSizes();

  const elements = getVisibleTextElements();

  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(el);
    const fontSize = computedStyle.fontSize;

    // Don't label tiny text or icons that might register as text
    if (rect.width === 0 || rect.height === 0) return;

    const label = document.createElement('div');
    label.className = 'font-size-inspector-label';
    label.textContent = fontSize;

    // Position the label at the top-left of the element
    // We use window.scrollY/X to account for scrolling
    label.style.top = (rect.top + window.scrollY) + 'px';
    label.style.left = (rect.left + window.scrollX) + 'px';

    document.body.appendChild(label);
    labels.push(label);
  });
}

function hideFontSizes() {
  labels.forEach(label => label.remove());
  labels = [];
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleOn") {
    active = true;
    showFontSizes();
    // Re-run on resize to keep positions correct
    window.addEventListener('resize', scheduleRefresh);
    // Also re-run on scroll (important for fixed elements/modals)
    window.addEventListener('scroll', scheduleRefresh, { passive: true });
  } else if (request.action === "toggleOff") {
    active = false;
    hideFontSizes();
    window.removeEventListener('resize', scheduleRefresh);
    window.removeEventListener('scroll', scheduleRefresh);
  }
});
