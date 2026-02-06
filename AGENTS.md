# Agent Notes (Codex / ChatGPT)

This repository is a **Chrome Extension (Manifest V3)**. There is **no build step** and **no dependencies**.

## What this extension does

- Clicking the extension icon toggles an “ON” badge and shows/hides **font-size labels** over **all visible text elements** on the page.
- Implementation is based on a background service worker that sends messages to a content script.

## Key files

- `manifest.json`: MV3 config; injects `content.js` + `styles.css` on `<all_urls>` and registers `background.js` as the service worker.
- `background.js`: Tracks per-tab state; sets the badge; sends `{ action: "toggleOn" }` / `{ action: "toggleOff" }`.
- `content.js`: Finds visible elements with direct text nodes; creates `.font-size-inspector-label` overlays positioned via `getBoundingClientRect()` + `scrollX/scrollY`; re-runs on `resize`.
- `styles.css`: Styles the overlay labels (pink background, high z-index, `pointer-events: none`).

## How to run/test

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. **Load unpacked** → select this repo folder
4. Visit any page and click the extension icon to toggle labels

Reloading:
- If you change `manifest.json` or `background.js`: click the extension **refresh** button in `chrome://extensions`.
- If you change `content.js` or `styles.css`: reload the target web page.

## Code conventions / guardrails

- Keep it **vanilla JS/CSS** (no bundlers, no frameworks).
- Avoid breaking pages: overlays must remain `pointer-events: none`.
- Be careful with performance: scanning `document.querySelectorAll('body *')` can be expensive on large pages; prefer incremental/targeted logic if adding features.

## Note on docs

- `README.md` describes the current “overlay labels” behavior.
- `GEMINI.md` currently describes a different hover-tooltip inspector and may be outdated.

