document.addEventListener('DOMContentLoaded', function() {
  const shortcutsContainer = document.getElementById('shortcuts-container');
  const addShortcutButton = document.getElementById('addShortcut');
  const saveButton = document.getElementById('save');
  
  let shortcuts = [];

  // 从存储中加载设置
  chrome.storage.sync.get(['shortcuts'], function(result) {
    shortcuts = result.shortcuts || [{key: 'Shift', speed: 2}];
    renderShortcuts();
  });

  function createShortcutElement(shortcut, index) {
    const div = document.createElement('div');
    div.className = 'shortcut-item';
    div.innerHTML = `
      <span class="delete-btn" data-index="${index}">×</span>
      <div class="form-group">
        <label>快捷键<span class="key-badge">${shortcut.key}</span></label>
        <input type="text" class="key-input" readonly placeholder="点击输入快捷键" value="${shortcut.key}">
      </div>
      <div class="form-group">
        <label>播放速度</label>
        <input type="number" class="speed-input" min="0.1" max="16" step="0.1" value="${shortcut.speed}">
      </div>
    `;
    return div;
  }

  function renderShortcuts() {
    shortcutsContainer.innerHTML = '';
    if (shortcuts.length === 0) {
      shortcutsContainer.innerHTML = '<div class="empty-state">还没有添加任何快捷键</div>';
    }
    shortcuts.forEach((shortcut, index) => {
      const element = createShortcutElement(shortcut, index);
      shortcutsContainer.appendChild(element);
    });

    // 添加事件监听器
    document.querySelectorAll('.key-input').forEach((input, index) => {
      input.addEventListener('keydown', function(e) {
        e.preventDefault();
        input.value = e.key;
        shortcuts[index].key = e.key;
      });
    });

    document.querySelectorAll('.speed-input').forEach((input, index) => {
      input.addEventListener('change', function() {
        shortcuts[index].speed = parseFloat(input.value);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const index = parseInt(btn.dataset.index);
        shortcuts.splice(index, 1);
        renderShortcuts();
      });
    });
  }

  addShortcutButton.addEventListener('click', function() {
    shortcuts.push({key: 'Shift', speed: 2});
    renderShortcuts();
  });

  saveButton.addEventListener('click', function() {
    chrome.storage.sync.set({
      shortcuts: shortcuts
    }, function() {
      alert('设置已保存！');
    });
  });
}); 