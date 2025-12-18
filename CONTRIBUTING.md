# Contributing to Gmail LinkedIn Connector

We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## Getting Started

1.  **Fork** the repository on GitHub.
2.  **Clone** your fork locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/gmail-linkedin-connector.git
    ```
3.  **Load** the extension in Chrome:
    - Go to `chrome://extensions/`
    - Enable **Developer mode**
    - Click **Load unpacked**
    - Select the cloned directory

## Workflow

1.  Create a branch for your feature (`git checkout -b feature/amazing-feature`).
2.  Make your changes.
3.  **Reload** the extension in `chrome://extensions/` to test your changes.
    - *Tip: If you edit `content/gmail.js`, you must refresh the Gmail tab.*
    - *Tip: If you edit `background/service_worker.js`, you must click "Update" or the reload icon on the extension card.*
4.  Commit your changes (`git commit -m 'Add some amazing feature'`).
5.  Push to the branch (`git push origin feature/amazing-feature`).
6.  Open a **Pull Request**.

## Code Style

-   **Vanilla JS**: We use standard ES6+ JavaScript. No build steps (Webpack/React) to keep it simple for now.
-   **CSS**: Simple CSS variables in `popup.css`.
-   **Manifest V3**: Ensure strict compliance with Chrome's V3 rules (no remote code, background service workers vs pages).

## Reporting Bugs

-   Use the **Bug Report** issue template.
-   Include your Browser Version (e.g. Chrome 120, Brave 1.60).
-   Describe exactly what happened ("I clicked X and nothing happened").
