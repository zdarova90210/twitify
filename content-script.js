(async function () {
  const YOUR_NICK       = 'zdarova90210';
  const YOUR_NICK_LOWER = YOUR_NICK.toLowerCase();
  const MENTION_SELECTOR = '[data-a-target="chat-message-mention"], .reply-line--mentioned';

  // звук алерта
  const alertSound = new Audio(chrome.runtime.getURL('alert.mp3'));
  alertSound.volume = 1;
  function playAlert() {
    alertSound.play().catch(() => {});
  }

  function checkNode(node) {
    if (!(node instanceof Element)) return;

    // 1) сам узел — упоминание
    if (node.matches(MENTION_SELECTOR) &&
      node.textContent.trim().toLowerCase() === `@${YOUR_NICK_LOWER}`) {
      playAlert();
      return;
    }

    // 2) упоминания внутри
    node.querySelectorAll(MENTION_SELECTOR).forEach(el => {
      if (el.textContent.trim().toLowerCase() === `@${YOUR_NICK_LOWER}`) {
        playAlert();
      }
    });
  }

  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(checkNode);
      }
      else if (m.type === 'characterData') {
        // при виртуализации Twitch может менять текст внутри уже существующих нод
        const p = m.target.parentElement;
        if (p && p.matches(MENTION_SELECTOR) &&
          p.textContent.trim().toLowerCase() === `@${YOUR_NICK_LOWER}`) {
          playAlert();
        }
      }
    }
  });

  mo.observe(document.body, {
    childList:     true,
    subtree:       true,
    characterData: true
  });
})();
