document.addEventListener('DOMContentLoaded', function() {
  // 初始化界面文本
  document.getElementById('addShortcut').textContent = chrome.i18n.getMessage('addShortcut');
  document.getElementById('save').textContent = chrome.i18n.getMessage('save');
  document.querySelector('.title').textContent = chrome.i18n.getMessage('extensionTitle');

  // 获取需要的 DOM 元素
  const shortcutsContainer = document.getElementById('shortcuts-container');
  const addShortcutButton = document.getElementById('addShortcut');
  const saveButton = document.getElementById('save');
  
  let shortcuts = [];

  // 从存储中加载设置
  chrome.storage.sync.get(['shortcuts'], function(result) {
    shortcuts = result.shortcuts || [
      { key: '2', speed: 2 },
      { key: '3', speed: 3 }
    ];
    renderShortcuts();
  });

  function createShortcutElement(shortcut, index) {
    const div = document.createElement('div');
    div.className = 'shortcut-item';
    
    // 创建删除按钮
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.dataset.index = index;
    deleteBtn.textContent = '×';
    
    // 创建第一个表单组
    const formGroup1 = document.createElement('div');
    formGroup1.className = 'form-group';
    
    const label1 = document.createElement('label');
    label1.textContent = chrome.i18n.getMessage('shortcutKey');
    
    const keyBadge = document.createElement('span');
    keyBadge.className = 'key-badge';
    keyBadge.textContent = formatKeyString(shortcut.key);
    
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.className = 'key-input';
    input1.readOnly = true;
    input1.placeholder = chrome.i18n.getMessage('clickToEnterShortcut');
    input1.value = formatKeyString(shortcut.key);
    
    // 创建第二个表单组
    const formGroup2 = document.createElement('div');
    formGroup2.className = 'form-group';
    
    const label2 = document.createElement('label');
    label2.textContent = chrome.i18n.getMessage('shortcutSpeed', [shortcut.key]);
    
    const input2 = document.createElement('input');
    input2.type = 'number';
    input2.className = 'speed-input';
    input2.min = '0.1';
    input2.max = '16';
    input2.step = '0.1';
    input2.value = shortcut.speed;
    
    // 组装元素
    label1.appendChild(keyBadge);
    formGroup1.appendChild(label1);
    formGroup1.appendChild(input1);
    
    formGroup2.appendChild(label2);
    formGroup2.appendChild(input2);
    
    div.appendChild(deleteBtn);
    div.appendChild(formGroup1);
    div.appendChild(formGroup2);
    
    return div;
  }

  function createHintText() {
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = chrome.i18n.getMessage('speedResetHint');
    return hint;
  }

  // 格式化快捷键显示
  function formatKeyString(keyString) {
    if (!keyString) return '';
    const keys = keyString.split('+');
    return keys.map(key => {
      switch(key) {
        case 'Control': return 'Ctrl';
        case ' ': return 'Space';
        default: return key;
      }
    }).join(' + ');
  }

  function renderShortcuts() {
    shortcutsContainer.innerHTML = '';
    if (shortcuts.length === 0) {
      const emptyState = document.createElement('div');
      emptyState.className = 'empty-state';
      emptyState.textContent = chrome.i18n.getMessage('noShortcuts');
      shortcutsContainer.appendChild(emptyState);
    } else {
      shortcuts.forEach((shortcut, index) => {
        const element = createShortcutElement(shortcut, index);
        shortcutsContainer.appendChild(element);
      });
    }

    // 修改键盘输入监听部分
    document.querySelectorAll('.key-input').forEach((input, index) => {
      input.addEventListener('keydown', function(e) {
        e.preventDefault();
        const keys = [];
        
        if (e.ctrlKey) keys.push('Control');
        if (e.altKey) keys.push('Alt');
        if (e.shiftKey) keys.push('Shift');
        if (e.metaKey) keys.push('Meta'); // Windows键/Command键
        
        // 只添加非修饰键
        if (!['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
          keys.push(e.key);
        }

        // 至少需要一个键
        if (keys.length > 0) {
          const keyString = keys.join('+');
          const formattedKeyString = formatKeyString(keyString);
          input.value = formattedKeyString;
          // 同时更新对应的标签显示
          input.parentElement.querySelector('.key-badge').textContent = formattedKeyString;
          shortcuts[index].key = keyString;
        }
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

  function showToast(message) {
    // 移除已存在的 toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
      existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    const toastContent = document.createElement('div');
    toastContent.className = 'toast-content';
    
    // 创建 SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'checkmark');
    svg.setAttribute('viewBox', '0 0 52 52');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'checkmark-circle');
    circle.setAttribute('cx', '26');
    circle.setAttribute('cy', '26');
    circle.setAttribute('r', '25');
    circle.setAttribute('fill', 'none');
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'checkmark-check');
    path.setAttribute('fill', 'none');
    path.setAttribute('d', 'M14.1 27.2l7.1 7.2 16.7-16.8');
    
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    
    svg.appendChild(circle);
    svg.appendChild(path);
    toastContent.appendChild(svg);
    toastContent.appendChild(messageSpan);
    toast.appendChild(toastContent);
    
    document.body.appendChild(toast);
    
    toast.addEventListener('animationend', (e) => {
      if (e.animationName === 'toast-out') {
        toast.remove();
      }
    });
  }

  // 修改保存按钮的处理函数
  saveButton.addEventListener('click', function() {
    chrome.storage.sync.set({
      shortcuts: shortcuts
    }, function() {
      showToast(chrome.i18n.getMessage('settingsSaved'));
    });
  });
}); 