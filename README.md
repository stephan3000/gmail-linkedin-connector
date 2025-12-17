# Gmail to LinkedIn Connector 🚀

A Chrome Extension that helps you quickly find LinkedIn profiles for people in your Gmail threads. 

**Safe, Private, and Open Source.**

![Extension Screenshot](https://raw.githubusercontent.com/placeholder-image.png)

## Why use this?
Recruiters, Salespeople, and Networkers often need to verify the LinkedIn profiles of people emailing them. 
This extension adds a **Side Panel** to Gmail that:
1.  **Scans** the open email thread for participants (Sender, CC, etc.).
2.  **Lists** them cleanly in the sidebar.
3.  **Generates** a one-click "Search on LinkedIn" button for each person.

## ✨ Features
-   **Privacy First**: No automated scraping, no shared sessions, no API abuse. 
-   **Smart Detection**: Identifies names and emails even from obfuscated Gmail DOM.
-   **Side Panel**: Persists on the right side of your screen; updates automatically as you switch emails.
-   **Floating Action Button**: Adds a convenient "in" button to Gmail for quick access.

## 📥 Installation

Since this project is experimental/open-source, you can install it as an "Unpacked Extension":

1.  Clone or download this repository.
2.  Open Chrome and go to `chrome://extensions`.
3.  Enable **Developer mode** (top right).
4.  Click **Load unpacked**.
5.  Select the `gmail-linkedin-extension` folder.

## 🛠️ Development

We welcome contributions! If you want to improve the name detection logic or UI:

### Project Structure
-   `manifest.json`: V3 Manifest.
-   `src/content/gmail.js`: The script that runs on Gmail pages to find names.
-   `src/background/service_worker.js`: Handles side panel toggling.
-   `src/popup`: The UI for the side panel.

### Ideas for Contribution
-   [ ] Better heuristic for extracting names from "Reply" threads.
-   [ ] Support for Outlook.com?
-   [ ] Dark mode for the sidebar.

## ⚠️ Disclaimer
This project is for educational purposes. It is not affiliated with LinkedIn or Google. It does not use private APIs or scrape data automatically.

## License
MIT
