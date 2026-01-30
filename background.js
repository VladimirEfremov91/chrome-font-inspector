chrome.action.onClicked.addListener((tab) => {
  // Check if we can send a message to the tab
  if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { action: "toggle" }).catch(err => {
          console.log("Error sending message (content script might not be loaded yet):", err);
      });
  }
});