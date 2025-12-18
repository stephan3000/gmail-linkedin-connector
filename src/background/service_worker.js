// Background service worker
console.log("Gmail LinkedIn Connector: Background service started.");

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    // Update Badge Text
    if (request.action === "updateBadge") {
        const count = request.count;
        const tabId = sender.tab ? sender.tab.id : null;

        if (tabId) {
            if (count > 0) {
                chrome.action.setBadgeText({ text: count.toString(), tabId: tabId });
                chrome.action.setBadgeBackgroundColor({ color: '#c00', tabId: tabId });
            } else {
                chrome.action.setBadgeText({ text: '', tabId: tabId });
            }
        }
    }

    // Check LinkedIn Status (Scraping-lite)
    if (request.action === "checkStatus") {
        const name = request.name;
        checkLinkedInStatus(name).then(status => {
            sendResponse({ status: status });
        }).catch(err => {
            console.error(err);
            sendResponse({ status: "Error" });
        });
        return true; // Keep channel open for async response
    }
});

// Force Popup behavior on install/startup
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setPopup({ popup: 'src/popup/popup.html' });
});

// Remove sidePanel specific legacy code if any (handled by manifest removal)

async function checkLinkedInStatus(name) {
    try {
        const query = encodeURIComponent(name);
        // We use the "People" search filter
        const url = `https://www.linkedin.com/search/results/people/?keywords=${query}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache'
            }
        });

        if (!response.ok) {
            return "Login Required"; // Likely 400/403/999 if not logged in
        }

        const text = await response.text();

        // Very basic heuristic scan of the result HTML
        // LinkedIn CSS classes change often, but text content "1st" is reliable-ish if we find the name nearby.

        // Check for login wall
        if (text.includes("auth_wall") || text.includes("Join LinkedIn")) {
            return "Login Required";
        }

        // Check for "No results found"
        if (text.includes("No results found")) {
            return "Not Found";
        }

        // We look for the first result that matches the name roughly
        // This is tricky with raw HTML. 
        // A simple heuristic: if we see "1st element-token" or similar text near the top few results.

        // Regex to look for "1st degree connection" indicators
        // "member-distance-badge ... visually-hidden">1st degree connection</span>

        if (text.search(/<span[^>]*class="[^"]*visually-hidden[^"]*"[^>]*>\s*1st degree connection\s*<\/span>/i) !== -1) {
            return "Connected (1st)";
        }

        if (text.search(/<span[^>]*class="[^"]*dist-value[^"]*"[^>]*>\s*1st\s*<\/span>/i) !== -1) {
            return "Connected (1st)";
        }

        // Look for generalized "1st" text which appears in the badge
        // This might false positive, but is a decent guess.
        if (text.includes('class="dist-value">1st</span>')) {
            return "Connected (1st)";
        }

        // 2nd
        if (text.includes('class="dist-value">2nd</span>')) {
            return "2nd Degree";
        }
        if (text.includes('class="dist-value">3rd+</span>')) {
            return "3rd Degree";
        }

        // Fallback: If we got results but no specific badge found, assume 3rd or Pending
        return "Not Connected";

    } catch (e) {
        console.error("Fetch Error:", e);
        return "Error";
    }
}
