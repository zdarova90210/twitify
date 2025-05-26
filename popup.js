document.addEventListener('DOMContentLoaded', () => {
  const nickInput = document.getElementById('nick');
  const saveBtn = document.getElementById('save');
  const statusDiv = document.getElementById('status');
  const volume = document.getElementById('volume');
  const volLabel = document.getElementById('volLabel');

  // Загрузка сохранённых настроек
  chrome.storage.sync.get(['twitifyNick', 'twitifyVolume'], ({twitifyNick, twitifyVolume}) => {
    if (twitifyNick) nickInput.value = twitifyNick;
    const v = (typeof twitifyVolume === 'number') ? twitifyVolume * 100 : 100;
    volume.value = v;
    volLabel.textContent = v + '%';
  });

  // Сохранение ника
  saveBtn.addEventListener('click', () => {
    const nick = nickInput.value.trim();
    if (!nick) {
      statusDiv.textContent = 'Никнейм не может быть пустым';
      return;
    }
    chrome.storage.sync.set({twitifyNick: nick}, () => {
      statusDiv.textContent = 'Никнейм сохранён!';
      setTimeout(() => window.close(), 1500);
    });
  });

  // Изменение громкости (при отпускании)
  volume.addEventListener('input', () => {
    volLabel.textContent = volume.value + '%';
  });
  volume.addEventListener('mouseup', () => {
    const vol = Number(volume.value) / 100;
    // Сохраняем настройку
    chrome.storage.sync.set({twitifyVolume: vol});
    // Тестовый звук
    const testAudio = new Audio(chrome.runtime.getURL('alert.mp3'));
    testAudio.volume = vol;
    testAudio.play().catch(() => {
    });
  });
});