function checkForSender() {
    const statusEl = document.getElementById('status');
    const profilesContainer = document.getElementById('profiles-container');

    // Reset UI State
    statusEl.classList.remove('hidden');
    profilesContainer.innerHTML = '';
    statusEl.innerText = "Scanning thread...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.url) return;

        if (activeTab.url.includes("mail.google.com")) {
            // 1. Get Senders from Gmail Content Script
            chrome.tabs.sendMessage(activeTab.id, { action: "getSender" }, (participants) => {
                if (chrome.runtime.lastError || !participants || participants.length === 0) {
                    statusEl.innerText = "No participants detected in this thread.";
                    return;
                }

                statusEl.innerText = `Found ${participants.length} people.`;
                statusEl.classList.add('hidden');

                // Process each participant
                participants.forEach(person => {
                    createProfileCard(person, profilesContainer);
                });

            });
        } else {
            statusEl.innerText = "Please open Gmail.";
        }
    });
}

function createProfileCard(person, container) {
    const card = document.createElement('div');
    card.className = 'profile-wrapper';

    // Construct Search URL
    const query = encodeURIComponent(person.name);
    const searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${query}`;

    card.innerHTML = `
        <div class="profile-header">
             <div>
                <p class="name">${person.name}</p>
                <p class="sub">${person.email || 'Email found'}</p>
             </div>
        </div>
        <div class="actions">
             <button class="primary btn-search">Search on LinkedIn</button>
        </div>`;

    // Bind Event
    const btnSearch = card.querySelector('.btn-search');
    btnSearch.onclick = () => {
        chrome.tabs.create({ url: searchUrl });
    };

    container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    checkForSender();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active && tab.url && tab.url.includes("mail.google.com")) {
        checkForSender();
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (tab && tab.url && tab.url.includes("mail.google.com")) {
            checkForSender();
        }
    });
});
