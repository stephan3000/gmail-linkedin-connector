// Background service worker
console.log("Gmail LinkedIn Connector: Background service started.");

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Open Side Panel from Content Script
    if (request.action === "openSidePanel") {
        // Trying to open the side panel for the current window
        if (sender.tab) {
            chrome.sidePanel.open({ tabId: sender.tab.id })
                .catch(err => console.error("Could not open side panel", err));
        }
    }
});

// Side Panel Behavior
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
    chrome.sidePanel.setOptions({
        path: 'src/popup/popup.html',
        enabled: true
    });
});
