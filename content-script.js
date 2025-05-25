(async () => {
  let nickLower;

  // Функция для установки/обновления ника
  async function updateNick() {
    const {twitifyNick} = await chrome.storage.sync.get('twitifyNick');
    if (twitifyNick) {
      nickLower = twitifyNick.toLowerCase();
      console.log('Twitify: текущий ник =', nickLower);
    } else {
      console.warn('Twitify: ник не задан');
    }
  }

  // Инициализация
  await updateNick();

  // Слушаем изменения хранилища
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.twitifyNick) {
      nickLower = changes.twitifyNick.newValue.toLowerCase();
      console.log('Twitify: ник обновлён на', nickLower);
    }
  });

  // Поиск контейнера чата
  const chat = document.querySelector('[data-test-selector="chat-scroller-list"]') || document.body;

  // Настройка звука
  const audio = new Audio(chrome.runtime.getURL('alert.mp3'));
  document.body.addEventListener('click', () => {
    audio.play().then(() => audio.pause()).catch(() => {
    });
  }, {once: true});

  function play() {
    audio.currentTime = 0;
    audio.play().catch(() => {
    });
  }

  // Обработка новых узлов
  function check(node) {
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
  }

  // Запуск MutationObserver
  const mo = new MutationObserver(muts => {
    muts.forEach(m => m.addedNodes.forEach(check));
  });
  mo.observe(chat, {childList: true, subtree: true});
})();