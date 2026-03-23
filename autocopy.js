/**
 * ──────── Auto Confirmation ────────
 * Auto-confirm the Google Docs "Copy
 * document" page, so the user doesn't
 * have to manually confirm.
 * ───────────────────────────────────
 */

(function () {
  'use strict';

  // Only run on /copy pages
  if (!location.pathname.includes('/copy')) return;

  function clickCopyButton() {
    // The button text is "Make a copy" inside a jfk-button or similar
    const buttons = Array.from(document.querySelectorAll('button, input[type="button"], .jfk-button'));
    for (const btn of buttons) {
      const text = (btn.textContent || btn.value || '').trim();
      if (/make a copy/i.test(text)) {
        console.log('[MakeCopy] Auto-clicking confirm button');
        btn.click();
        return true;
      }
    }
    return false;
  }

  // Try immediately, then poll — the button may not be in DOM yet
  if (!clickCopyButton()) {
    let attempts = 0;
    const interval = setInterval(function () {
      attempts++;
      if (clickCopyButton() || attempts > 40) {
        clearInterval(interval);
      }
    }, 100);
  }
}());
