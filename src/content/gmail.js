// Gmail Content Script
console.log("Gmail LinkedIn Connector: Content script loaded.");

// Function to extract all unique participants from the thread
function getThreadParticipants() {
    // Try to clean up current user email from title "Inbox - user@gmail.com - Gmail"
    const titleMatch = document.title.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/);
    const myEmail = titleMatch ? titleMatch[1].toLowerCase() : null;

    // We use the existing .gD class which Gmail uses for people/contacts.
    // This will pick up Senders, and often people in the "to" field if expanded.
    const elements = document.querySelectorAll('.gD');
    const participants = new Map();

    elements.forEach(el => {
        const email = el.getAttribute('email');
        let name = el.textContent || el.getAttribute('name');

        // Skip myself
        if (email && myEmail && email.toLowerCase() === myEmail) return;
        if (name && name.toLowerCase() === 'me') return;

        // Clean name: Remove quotes, extra spaces
        if (name) {
            name = name.replace(/['"]/g, '').trim();
            // If name is same as email, try to derive name from email username
            if (name === email || name.includes('@')) {
                // heuristic: john.doe@... -> John Doe
                const username = email.split('@')[0];
                name = username.replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            }
        }

        if (email && !participants.has(email)) {
            participants.set(email, { name, email });
        }
    });

    // Also try to find the "me" element if not present? No, usually we ignore "me".
    // But the user might want to connect with someone they sent to.

    if (participants.size > 0) {
        return Array.from(participants.values());
    }

    return null;
}

// Inject a button to help user open the sidebar if they can't find it
function injectTriggerButton() {
    if (document.getElementById('linkedin-trigger-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'linkedin-trigger-btn';
    btn.innerText = 'in'; // LinkedIn Logo style text

    // Style it to look like a small floating action button or integrated pill
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '40px',
        height: '40px',
        backgroundColor: '#0a66c2',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: '9999',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
    });

    btn.onclick = () => {
        chrome.runtime.sendMessage({ action: "openSidePanel" });
    };

    document.body.appendChild(btn);
}

// Run injection
injectTriggerButton();

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getSender") {
        const info = getThreadParticipants();
        sendResponse(info);
    }
});
