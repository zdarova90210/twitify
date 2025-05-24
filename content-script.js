(async function () {
  const YOUR_NICK = 'zdarova90210';
  const YOUR_NICK_LOWER = YOUR_NICK.toLowerCase();

  const alertSound = new Audio(chrome.runtime.getURL('alert.mp3'));
  alertSound.volume = 1;

  function handleMessage(msgEl) {
    // 1) @-упоминания
    const mentionEls = msgEl.querySelectorAll('[data-a-target="chat-message-mention"]');
    for (const m of mentionEls) {
      if (m.textContent.trim().toLowerCase() === `@${YOUR_NICK_LOWER}`) {
        alertSound.play().catch();
        return;
      }
    }

    // 2) reply — текстовая проверка “Replying to …”
    const headerP = msgEl.querySelector('p');
    if (headerP) {
      const txt = headerP.textContent.trim().toLowerCase();
      if (txt.startsWith('replying to') && txt.includes(`@${YOUR_NICK_LOWER}`)) {
        alertSound.play().catch();
      }
    }
  }

  function observe(container) {
    const mo = new MutationObserver(records => {
      for (const rec of records) {
        for (const node of rec.addedNodes) {
          if (node.nodeType !== 1) continue;
          if (node.matches('[data-a-target="chat-line-message"]')) {
            handleMessage(node);
          }
          node.querySelectorAll?.('[data-a-target="chat-line-message"]')
            .forEach(handleMessage);
        }
      }
    });
    mo.observe(container, {childList: true, subtree: true});
  }

  function init() {
    const scroller = document.querySelector('[data-a-target="chat-scroller"]');
    const container = scroller?.querySelector('[role="log"]');
    if (container) {
      observe(container);
    } else {
      setTimeout(init, 1000);
    }
  }

  init();
})();
