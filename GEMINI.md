# Font Size Inspector - Chrome Extension

## Project Overview

**Font Size Inspector** is a lightweight Google Chrome extension (Manifest V3) that allows users to quickly inspect font properties of any element on a webpage. When activated, hovering over elements displays a tooltip containing the font size, line height, and font family, while highlighting the element with a colored outline.

### Key Features
*   **Toggleable Activation:** Click the extension icon to enable or disable inspection mode.
*   **Instant Feedback:** Hover over any element to see its typography details immediately.
*   **Visual Highlighting:** The inspected element is outlined in pink (`#ff4081`) to clearly indicate selection.
*   **Non-Intrusive:** The tooltip floats near the cursor and ignores pointer events to avoid interfering with navigation.

## Architecture & Core Files

The project follows a standard Chrome Extension architecture (Manifest V3):

*   **`manifest.json`**: The configuration file.
    *   **Version:** 1.0
    *   **Permissions:** `activeTab`, `scripting`.
    *   **Content Scripts:** Injects `content.js` and `styles.css` into all URLs (`<all_urls>`).
    *   **Background:** Uses `background.js` as a service worker to handle the browser action click.

*   **`background.js`**: The service worker.
    *   Listens for the extension icon click event (`chrome.action.onClicked`).
    *   Sends a generic `"toggle"` message to the content script in the active tab.

*   **`content.js`**: The main logic running in the context of the web page.
    *   Manages the `active` state.
    *   Listens for the `"toggle"` message.
    *   **On Enable:** Attaches `mouseover` and `mouseout` event listeners to the `document`.
    *   **On Hover:**
        *   Calculates computed styles (`window.getComputedStyle`) for `fontSize`, `fontFamily`, and `lineHeight`.
        *   Dynamically creates or updates a DOM element (`#font-size-inspector-tooltip`) to display data.
        *   Applies a visual outline to the target element.
    *   **On Disable:** Removes listeners and cleans up outlines/tooltips.

*   **`styles.css`**:
    *   Styles the tooltip (`#font-size-inspector-tooltip`) with a high `z-index` to ensure visibility over active page content.
    *   Uses a dark theme for high contrast.

## Installation & Usage

Since this is a raw source code project (no build step required), you can load it directly into Chrome.

1.  Open Chrome and navigate to `chrome://extensions`.
2.  Enable **Developer mode** (toggle switch in the top right corner).
3.  Click the **Load unpacked** button.
4.  Select this directory (`/Users/alfa/Documents/git/chrome-font-inspector`).
5.  The extension "Font Size Inspector" should now appear in your list.

**To Use:**
1.  Navigate to any website.
2.  Click the extension icon in the Chrome toolbar.
3.  Hover over text to see font details.
4.  Click the icon again to turn it off.

## Development

*   **Tech Stack:** Vanilla JavaScript, CSS, HTML (generated via JS).
*   **Build Process:** None. Files are edited directly.
*   **Reloading:** After making changes to `manifest.json` or `background.js`, you must click the **refresh icon** on the extension card in `chrome://extensions`. For changes to `content.js` or `styles.css`, simply reload the web page you are testing on.

### Future Improvements (TODO)
*   Add ability to copy font details to clipboard on click.
*   Add a color picker or text color inspector.
*   Persist "active" state across page reloads using `chrome.storage`.
