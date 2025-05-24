const YOUR_USERNAME = 'twitifytest';

const testSound = new Audio(chrome.runtime.getURL('alert.mp3'));
testSound.play().then(() => {
  console.log('[Twitify] Звук проигран при загрузке страницы');
}).catch(err => {
  console.error('[Twitify] Ошибка воспроизведения звука:', err);
});