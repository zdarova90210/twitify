document.addEventListener('DOMContentLoaded', () => {
  const nickInput = document.getElementById('nick');
  const saveBtn = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // загрузить сохранённый ник
  chrome.storage.sync.get('twitifyNick', ({twitifyNick}) => {
    if (twitifyNick) {
      nickInput.value = twitifyNick;
    }
  });

  saveBtn.addEventListener('click', () => {
    const nick = nickInput.value.trim();
    if (!nick) {
      statusDiv.textContent = 'Никнейм не может быть пустым';
      return;
    }

    chrome.storage.sync.set({twitifyNick: nick}, () => {
      statusDiv.textContent = 'Сохранено!';
      setTimeout(() => window.close(), 1500);
    });
  });
});