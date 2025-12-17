# How to Publish to Chrome Web Store

**Note:** You need a Google Developer Account (one-time $5 fee).

## 1. Prepare Package
I have already created the zip file for you:
`gmail-linkedin-connector.zip` inside the extension folder.

## 2. Developer Dashboard
1.  Go to the [Chrome Developer Dashboard](https://chrome.google.com/webstore/dev/dashboard).
2.  Sign in with your Google Account.
3.  If you haven't already, pay the **$5 registration fee**.

## 3. Upload
1.  Click **+ New Item**.
2.  Drag and drop the `gmail-linkedin-connector.zip` file.
3.  Wait for the upload to finish.

## 4. Store Listing
Fill in the required fields:
-   **Description**: Copy the text from `README.md`.
-   **Category**: "Productivity" or "Social & Communication".
-   **Language**: English.
-   **Icons**: Ensure the icon looks good (we verified them).
-   **Screenshots**: You need to take at least 1 screenshot of the extension in action (Gmail with Sidebar open) and upload it (1280x800 is best).

## 5. Privacy Practices
-   **Host Permissions**: We use `mail.google.com`. Justification: "To detect email sender names."
-   **Remote Code**: No.
-   **Data Usage**: We do NOT collect user data. Check "No" for data collection.

## 6. Submit
Click **Submit for Review**. It usually takes 1-2 days for approval.
