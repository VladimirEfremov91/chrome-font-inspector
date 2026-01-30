let active = false;
let tooltip = null;

function createTooltip() {
  const div = document.createElement("div");
  div.id = "font-size-inspector-tooltip";
  document.body.appendChild(div);
  return div;
}

function handleMouseOver(e) {
  if (!active) return;
  
  const target = e.target;
  // Don't inspect the tooltip itself
  if (target.id === "font-size-inspector-tooltip") return;

  const computedStyle = window.getComputedStyle(target);
  const fontSize = computedStyle.fontSize;
  const fontFamily = computedStyle.fontFamily;
  const lineHeight = computedStyle.lineHeight;

  if (!tooltip) tooltip = createTooltip();

  tooltip.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 2px;">Font Size: ${fontSize}</div>
    <div style="font-size: 0.9em; opacity: 0.9;">Line Height: ${lineHeight}</div>
    <div style="font-size: 0.8em; opacity: 0.8; margin-top: 2px;">${fontFamily}</div>
  `;
  
  tooltip.style.display = "block";
  
  // Position tooltip near cursor but prevent overflow
  const x = e.pageX + 15;
  const y = e.pageY + 15;
  
  tooltip.style.top = y + "px";
  tooltip.style.left = x + "px";
  
  target.style.outline = "2px solid #ff4081";
  target.style.cursor = "help";
}

function handleMouseOut(e) {
  if (!active) return;
  if (tooltip) tooltip.style.display = "none";
  e.target.style.outline = "";
  e.target.style.cursor = "";
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggle") {
    active = !active;
    if (active) {
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
      // Create tooltip immediately so it's ready
      if (!tooltip) tooltip = createTooltip();
      console.log("Font Inspector: ON");
    } else {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (tooltip) tooltip.style.display = "none";
      // Clear any outlines
      document.querySelectorAll('*').forEach(el => {
          el.style.outline = '';
          if (el.style.cursor === "help") el.style.cursor = "";
      });
      console.log("Font Inspector: OFF");
    }
  }
});