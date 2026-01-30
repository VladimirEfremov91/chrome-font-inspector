let labels = [];

function getVisibleTextElements() {
  const allElements = document.querySelectorAll('body *');
  const textElements = [];

  for (const el of allElements) {
    // 1. Check if element is visible
    if (el.offsetParent === null) continue; // Hidden element
    
    // 2. Check if element has direct text content (ignore empty containers)
    let hasDirectText = false;
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
        hasDirectText = true;
        break;
      }
    }

    if (hasDirectText) {
      textElements.push(el);
    }
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
    showFontSizes();
    // Re-run on resize to keep positions correct
    window.addEventListener('resize', showFontSizes);
  } else if (request.action === "toggleOff") {
    hideFontSizes();
    window.removeEventListener('resize', showFontSizes);
  }
});