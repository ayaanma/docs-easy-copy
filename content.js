/**
 * ──────── Docs Easy Copy ───────────
 * Adds a "Make a Copy" button to menu.
 * Doc ID is resolved at click time by
 * walking up to the parent card and 
 * reading the thumbnail URL.
 * ───────────────────────────────────
 */

(function () {
  'use strict';

  const INJECTED_ATTR = 'data-mc-done';

  // ── Get doc ID from the card that owns a given menu ───────────────────────

  function docIdFromMenu(menu) {
    const card = menu.closest('.docs-homescreen-grid-item');
    if (!card) return null;
    const thumb = card.querySelector('.docs-homescreen-grid-item-thumbnail');
    if (!thumb) return null;
    const m = (thumb.style.backgroundImage || '').match(/\/d\/([a-zA-Z0-9_-]{20,})/);
    return m ? m[1] : null;
  }

  // ── Build the "Make a copy" item and attach it to a menu ──────────────────

  function injectIntoMenu(menu) {
    if (menu.hasAttribute(INJECTED_ATTR)) return;
    menu.setAttribute(INJECTED_ATTR, '1');

    const items = Array.from(menu.querySelectorAll(':scope > .goog-menuitem'));
    if (!items.length) return;

    // Use "Open in new tab" as the style reference
    const refItem = items.find(item => {
      const lbl = item.querySelector('.docs-homescreen-overflowmenuitem-text');
      return lbl && /open in (a )?new tab/i.test(lbl.textContent.trim());
    }) || items[items.length - 1];

    // Build item from scratch using refItem's structure
    const newItem = document.createElement('div');
    newItem.className = Array.from(refItem.classList)
      .filter(c => !['goog-menuitem-disabled', 'goog-option'].includes(c))
      .join(' ');
    newItem.setAttribute('role', 'menuitem');
    newItem.style.cursor = 'pointer';

    const refContent = refItem.querySelector('.goog-menuitem-content');
    if (refContent) {
      const content = refContent.cloneNode(true);

      // Set label
      const lbl = content.querySelector('.docs-homescreen-overflowmenuitem-text');
      if (lbl) lbl.textContent = 'Make a copy';

      // Replace icon with copy icon
      const iconContainer = content.querySelector('.docs-homescreen-overflowmenuitem-icon')
                         || content.querySelector('.docs-homescreen-icon')
                         || content.querySelector('svg')?.parentElement;
      if (iconContainer) {
        iconContainer.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.style.cssText = 'display:block;fill:#444746;';
        svg.innerHTML =
          '<path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1z"/>' +
          '<path d="M19 5H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7' +
          'c0-1.1-.9-2-2-2zM19 21H8V7h11v14z"/>';
        iconContainer.appendChild(svg);
      }

      newItem.appendChild(content);
    } else {
      newItem.textContent = 'Make a copy';
      newItem.style.padding = '8px 16px';
    }

    // Hover
    newItem.addEventListener('mouseenter', () => newItem.classList.add('goog-menuitem-highlight'));
    newItem.addEventListener('mouseleave', () => newItem.classList.remove('goog-menuitem-highlight'));

    // Click: resolve doc ID at click time from the card that owns this menu
    newItem.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const docId = docIdFromMenu(menu);
      if (docId) {
        window.open('https://docs.google.com/document/d/' + docId + '/copy', '_blank');
      } else {
        alert('[Make a copy] Could not find document ID.');
      }
    });

    refItem.insertAdjacentElement('afterend', newItem);
  }

  // ── Inject into all menus now and watch for any added later ───────────────

  function injectAll() {
    document.querySelectorAll(
      '.docs-homescreen-iconmenu:not([' + INJECTED_ATTR + '])'
    ).forEach(injectIntoMenu);
  }

  // Initial injection — poll briefly since cards may render after document_idle
  injectAll();
  let attempts = 0;
  const poll = setInterval(function () {
    injectAll();
    if (++attempts >= 20) clearInterval(poll); // stop after 4 seconds
  }, 200);

  // Also catch any menus added later (lazy-loaded cards on scroll)
  new MutationObserver(injectAll)
    .observe(document.body, { childList: true, subtree: true });

  console.log('[MakeCopy] v12 loaded');

}());
