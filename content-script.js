(async () => {
  let nickLower;
  let volume = 1;

  // Обновить ник
  async function updateNick() {
    const {twitifyNick} = await chrome.storage.sync.get('twitifyNick');
    nickLower = twitifyNick ? twitifyNick.toLowerCase() : null;
  }

  // Обновить громкость
  async function updateVolume() {
    const {twitifyVolume} = await chrome.storage.sync.get('twitifyVolume');
    volume = (typeof twitifyVolume === 'number') ? twitifyVolume : 1;
    audio.volume = volume;
  }

  // Инициализация
  await updateNick();

  // Настройка аудио
  const audio = new Audio(chrome.runtime.getURL('alert.mp3'));
  await updateVolume();

  // Отложенный перехват клика для разблокировки аудио в некоторых браузерах
  document.body.addEventListener('click', () => {
    audio.play().then(() => audio.pause()).catch(() => {
    });
  }, {once: true});

  function play() {
    audio.currentTime = 0;
    audio.play().catch(() => {
    });
  }

  // Слушаем изменения в хранилище
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.twitifyNick) {
        nickLower = changes.twitifyNick.newValue.toLowerCase();
      }
      if (changes.twitifyVolume) {
        volume = changes.twitifyVolume.newValue;
        audio.volume = volume;
      }
    }
  });

  // Следим за чатом
  const chat = document.querySelector('[data-test-selector="chat-scroller-list"]') || document.body;
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(node => {
      if (!nickLower || !(node instanceof Element)) return;
      const text = node.textContent.toLowerCase();
      if (text.includes(`@${nickLower}`)) {
        play();
        return;
      }
      node.querySelectorAll('[data-a-target="chat-message-mention"], .reply-line--mentioned')
        .forEach(el => {
          if (el.textContent.toLowerCase().startsWith(`@${nickLower}`)) {
            play();
          }
        });
    }));
  });
  mo.observe(chat, {childList: true, subtree: true});
})();