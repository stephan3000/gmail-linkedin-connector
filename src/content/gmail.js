// Gmail Content Script - Toolbar Badge Version
console.log("Gmail LinkedIn Connector: Content script loaded (v4.0 - Toolbar Badge).");

// Function to extract all unique participants from the thread
function getThreadParticipants() {
    // 1. Title Heuristic: "Subject - user@gmail.com - Gmail"
    // Anchor to the end to avoid matching emails in the Subject line
    const titleMatch = document.title.match(/-\s+([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)\s+-\s+Gmail$/);
    let myEmail = titleMatch ? titleMatch[1].toLowerCase() : null;

    // 2. Account Button Heuristic (More Reliable if DOM is loaded)
    if (!myEmail) {
        const accountBtn = document.querySelector('a[href*="SignOutOptions"], a[aria-label*="Google Account"]');
        if (accountBtn) {
            const aria = accountBtn.getAttribute('aria-label') || '';
            const match = aria.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
            if (match) myEmail = match[1].toLowerCase();
        }
    }

    // Use multiple selectors to be more robust
    const elements = document.querySelectorAll('.gD, span[email]');

    if (elements.length === 0) {
        return null;
    }

    const participants = new Map();
    const blacklist = ['google', 'team', 'support', 'reminder', 'calendar', 'no-reply', 'noreply', 'mailer-daemon', 'notification', 'update', 'alert', 'newsletter'];

    elements.forEach(el => {
        // Visibility Check: Ensure element is visible on screen
        // This prevents capturing names from hidden views or previous threads in Gmail's SPA
        if (!el.offsetParent) return;

        const email = el.getAttribute('email');
        if (!email) return;

        // Name Extraction Waterfall
        // 1. Explicit 'name' attribute
        // 2. 'aria-label' (often "Email from John Doe", very reliable)
        // 3. 'textContent' (fallback)
        let name = el.getAttribute('name');

        if (!name) {
            const ariaLabel = el.getAttribute('aria-label');
            if (ariaLabel) {
                // Format: "Email from Name <email>" or "Name"
                name = ariaLabel.replace(/^Email from /i, '').replace(/<.*>/, '').trim();
            }
        }

        if (!name) {
            name = el.textContent;
        }

        // Clean name
        if (name) {
            // Remove quotes, trim
            name = name.replace(/['"]/g, '').trim();
            // Handle Gmail's lazy truncation ("Name...")
            if (name.endsWith('...')) {
                name = name.replace('...', '');
            }

            // Heuristic: If name is just "Me" or same as email, try to prettify header
            if (name.toLowerCase() === 'me' || name === email || name.includes('@')) {
                const username = email.split('@')[0];
                name = username.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        } else {
            // Absolute fallback
            const username = email.split('@')[0];
            name = username.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }

        // 3. Blacklist Filtering
        const lowerName = name.toLowerCase();
        const lowerEmail = email.toLowerCase();

        const isBlacklisted = blacklist.some(term => lowerName.includes(term) || lowerEmail.includes(term));
        if (isBlacklisted) return;


        // Try to find Avatar
        // Gmail structure varies. Often .gD is inside a container, and the avatar is a sibling or uncle.
        // We look for nearest parent row, then find 'img'.
        let avatarUrl = null;
        try {
            // Traverse up to find a row-like container (often has role="gridcell" or similar, or just a few parents up)
            // Limit traversal to avoid performance hit
            let parent = el.parentElement;
            let foundImg = null;

            for (let i = 0; i < 5; i++) {
                if (!parent) break;
                // Look for an image that looks like an avatar (often has distinctive classes or attributes)
                // Gmail avatars often have class "acd" or "f" or just sit in "div.oj"
                const img = parent.querySelector('img.acd, div.oj img, img[src*="googleusercontent"]');
                if (img && img.src && img.src.length > 0) {
                    foundImg = img;
                    break;
                }
                parent = parent.parentElement;
            }

            if (foundImg) {
                avatarUrl = foundImg.src;
            }
        } catch (e) {
        // Ignore DOM errors
        }

        if (email && !participants.has(email)) {
            // Final Self Check
            if (myEmail && email.toLowerCase() === myEmail) return;
            if (name && name.toLowerCase() === 'me') return;

            participants.set(email, { name, email, avatarUrl });
        }
    });

    return Array.from(participants.values());
}

// Logic to count participants and update EXTENSION BADGE
function startScanning() {
    updateBadgeCount();
    setInterval(updateBadgeCount, 2000);
}

function updateBadgeCount() {
    const people = getThreadParticipants();
    const count = people ? people.length : 0;

    // Send count to Background Worker to update the Toolbar Badge
    chrome.runtime.sendMessage({
        action: "updateBadge",
        count: count 
    });
}

// Listen for messages from popup (if it opens and wants fresh data)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSender") {
        const info = getThreadParticipants();
        sendResponse(info);
    }
});

// Start Main Logic
startScanning();
