// Track state per tab
const tabStates = {};

chrome.action.onClicked.addListener(async (tab) => {
  const tabId = tab.id;
  
  // Toggle state
  const currentState = tabStates[tabId] || false;
  const newState = !currentState;
  tabStates[tabId] = newState;

  if (newState) {
    // Turn ON
    await chrome.action.setBadgeText({ tabId: tabId, text: "ON" });
    await chrome.action.setBadgeBackgroundColor({ tabId: tabId, color: "#ff4081" });
    
    chrome.tabs.sendMessage(tabId, { action: "toggleOn" }).catch(err => {
      console.log("Error sending message:", err);
    });
  } else {
    // Turn OFF
    await chrome.action.setBadgeText({ tabId: tabId, text: "" }); // Remove badge
    
    chrome.tabs.sendMessage(tabId, { action: "toggleOff" }).catch(err => {
      console.log("Error sending message:", err);
    });
  }
});

// Clean up state when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabStates[tabId]) {
    delete tabStates[tabId];
  }
});