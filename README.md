# Docs Easy Copy

A lightweight Chrome extension that adds a **"Make a copy"** button to the 3-dot (⋮) context menu on the Google Docs homepage so you can duplicate any document in one click without ever opening it.

---

## How It Works

Google pre-renders all the 3-dot menus in the DOM at page load and simply toggles their visibility with a CSS class. The extension:

1. **At page load**, scans for every `.docs-homescreen-iconmenu` element and permanently injects a "Make a copy" item into each one
2. **On click**, resolves the document ID at that moment by reading the thumbnail's `background-image` URL on the parent card — which contains the Google Drive file ID
3. **Opens** `docs.google.com/document/d/{ID}/copy` in a new tab
4. A second content script running on `/copy` pages automatically clicks the "Make a copy" confirm button, skipping the confirmation screen entirely

---

## Installation

### From the Chrome Web Store *(recommended)*
*(Link coming soon)*

### Manual / Developer Install
1. Clone or download this repository
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the folder containing `manifest.json`


