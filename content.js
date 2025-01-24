let originalSpeeds = new WeakMap();
let shortcuts = [{key: 'Shift', speed: 2}];

// 从存储中获取设置
chrome.storage.sync.get(['shortcuts'], function(result) {
  shortcuts = result.shortcuts || [{key: 'Shift', speed: 2}];
});

// 监听存储变化
chrome.storage.onChanged.addListener(function(changes) {
  if (changes.shortcuts) {
    shortcuts = changes.shortcuts.newValue;
  }
});

// 监听键盘事件
document.addEventListener('keydown', function(e) {
  const shortcut = shortcuts.find(s => s.key === e.key);
  if (shortcut) {
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
      if (!originalSpeeds.has(video)) {
        originalSpeeds.set(video, video.playbackRate);
      }
      video.playbackRate = shortcut.speed;
    }
  }
});

document.addEventListener('keyup', function(e) {
  const shortcut = shortcuts.find(s => s.key === e.key);
  if (shortcut) {
    const videos = document.getElementsByTagName('video');
    for (let video of videos) {
      const originalSpeed = originalSpeeds.get(video) || 1;
      video.playbackRate = originalSpeed;
    }
  }
});