function checkForSender() {
    const statusEl = document.getElementById('status');
    const profilesContainer = document.getElementById('profiles-container');

    statusEl.classList.remove('hidden');
    profilesContainer.innerHTML = '';
    statusEl.innerText = "Scanning thread...";

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (!activeTab || !activeTab.id) {
            statusEl.innerText = "Error: No active tab.";
            return;
        }

        if (activeTab.url && activeTab.url.includes("mail.google.com")) {
            chrome.tabs.sendMessage(activeTab.id, { action: "getSender" }, (participants) => {

                if (chrome.runtime.lastError) {
                    // Fail silently or show generic message, not full stack trace
                    statusEl.innerText = "Please refresh your Gmail tab.";
                    console.warn(chrome.runtime.lastError.message);
                    return;
                }

                if (!participants || participants.length === 0) {
                    statusEl.innerText = "No participants found.";
                    return;
                }

                statusEl.innerText = `Found ${participants.length} people.`;
                statusEl.classList.add('hidden');

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

    // Avatar Logic
    let avatarHtml = '';
    if (person.avatarUrl) {
        avatarHtml = `<img src="${person.avatarUrl}" class="avatar" alt="Photo">`;
    } else {
        const initials = person.name ? person.name.charAt(0).toUpperCase() : '?';
        avatarHtml = `<div class="avatar-placeholder">${initials}</div>`;
    }

    card.innerHTML = `
        <div class="profile-header">
             ${avatarHtml}
             <div class="info">
                <p class="name">${person.name || 'Unknown'}</p>
                 <div class="meta-row">
                    <span class="status-badge hidden" id="status-${person.email ? person.email.replace(/[^a-zA-Z0-9]/g, '') : 'unknown'}"></span>
                </div>
             </div>
        </div>
        <div class="actions">
             <button class="secondary btn-check">Check Status</button>
             <button class="primary btn-search">Search</button>
        </div>`;

    // Bind Search Event
    const btnSearch = card.querySelector('.btn-search');
    btnSearch.onclick = () => {
        chrome.tabs.create({ url: searchUrl });
    };

    // Bind Check Event
    const btnCheck = card.querySelector('.btn-check');
    const safeId = person.email ? person.email.replace(/[^a-zA-Z0-9]/g, '') : 'unknown';
    const statusBadge = card.querySelector(`#status-${safeId}`);

    btnCheck.onclick = () => {
        btnCheck.disabled = true;
        btnCheck.innerText = "Checking...";

        chrome.runtime.sendMessage({ action: "checkStatus", name: person.name }, (response) => {
            btnCheck.style.display = 'none'; // Hide button after check
            statusBadge.classList.remove('hidden');

            if (response && response.status) {
                statusBadge.innerText = response.status;

                if (response.status.includes("1st")) {
                    statusBadge.style.backgroundColor = '#057642'; // Green
                } else if (response.status.includes("Login")) {
                    statusBadge.style.backgroundColor = '#c00'; // Red
                } else {
                    statusBadge.style.backgroundColor = '#666'; // Grey
                }
            } else {
                statusBadge.innerText = "Unknown";
            }
        });
    };

    container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    checkForSender();
});
