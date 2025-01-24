// 默认快捷键
const defaultShortcuts = [
  { key: '2', speed: 2 },
  { key: '3', speed: 3 },
]

let originalSpeeds = new WeakMap();
let shortcuts = defaultShortcuts;

// 从存储中获取设置
chrome.storage.sync.get(['shortcuts'], function(result) {
  shortcuts = result.shortcuts || defaultShortcuts;
});

// 监听存储变化
chrome.storage.onChanged.addListener(function(changes) {
  if (changes.shortcuts) {
    shortcuts = changes.shortcuts.newValue;
  }
});

// 检查快捷键是否匹配
function checkShortcut(e, shortcutKey) {
  const keys = shortcutKey.split('+');
  
  // 检查修饰键状态
  const modifierStatus = {
    'Control': e.ctrlKey,
    'Alt': e.altKey,
    'Shift': e.shiftKey,
    'Meta': e.metaKey
  };

  // 检查所有键是否匹配
  return keys.every(key => {
    if (key in modifierStatus) {
      return modifierStatus[key];
    }
    return e.key === key;
  });
}

// 检查是否在输入框中
function isTypingInInput(e) {
  const target = e.target;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.contentEditable === 'true'
  );
}

// 监听键盘事件
document.addEventListener('keydown', function(e) {
  // 如果用户正在输入，则不触发快捷键
  if (isTypingInInput(e)) {
    return;
  }

  shortcuts.forEach(shortcut => {
    if (checkShortcut(e, shortcut.key)) {
      const videos = document.getElementsByTagName('video');
      for (let video of videos) {
        // 只在第一次按下快捷键时保存原始速度
        if (!originalSpeeds.has(video)) {
          originalSpeeds.set(video, video.playbackRate);
        }
        video.playbackRate = shortcut.speed;
      }
    }
  });
});

document.addEventListener('keyup', function(e) {
  // 如果用户正在输入，则不触发快捷键
  if (isTypingInInput(e)) {
    return;
  }

  shortcuts.forEach(shortcut => {
    if (checkShortcut(e, shortcut.key)) {
      const videos = document.getElementsByTagName('video');
      for (let video of videos) {
        if (originalSpeeds.has(video)) {
          video.playbackRate = originalSpeeds.get(video);
          originalSpeeds.delete(video); // 恢复后清除保存的速度
        }
      }
    }
  });
});