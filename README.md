# Gmail to LinkedIn Connector (Beta 0.1) 🚀

A Chrome Extension that helps you quickly find LinkedIn profiles for people in your Gmail threads. 

**Safe, Private, and Open Source.**

## ✨ Features
-   **Toolbar Integration**: Lives in your browser toolbar, no intrusive sidebars.
-   **Smart Badges**: Shows a red notification badge (e.g., "2") when email participants are found.
-   **Profile Pictures**: Extracts and displays Gmail avatars for quick identification.
-   **Connection Status**: Manually check if you are 1st, 2nd, or 3rd degree connections (safe, no auto-scraping).
-   **Smart Filtering**: Automatically ignores non-human senders like "Google", "Team", "No-Reply".

## 📥 Installation

1.  Clone or download this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer mode** (top right).
4.  Click **Load unpacked**.
5.  Select the `gmail-linkedin-extension` folder.

## 🛠️ Development

### Project Structure
-   `manifest.json`: V3 Manifest.
-   `src/content/gmail.js`: Scans the DOM for participants and "Check Status" logic.
-   `src/background/service_worker.js`: Handles badge updates and cross-origin stats checks.
-   `src/popup`: The UI for the profile list.

## ⚠️ Disclaimer
This project is for educational purposes. It is not affiliated with LinkedIn or Google. It does not use private APIs or scrape data automatically.

## License
MIT
