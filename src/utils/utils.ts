// 特殊键的映射表
const keyDisplayMap: { [key: string]: string } = {
  // 功能键
  Escape: 'Esc',
  Insert: 'Ins',
  Delete: 'Del',
  Home: 'Home',
  End: 'End',
  PageUp: 'PgUp',
  PageDown: 'PgDn',
  Pause: 'Pause',
  ScrollLock: 'Scroll Lock',
  CapsLock: 'Caps Lock',
  NumLock: 'Num Lock',
  ContextMenu: 'Menu',

  // 方向键
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',

  // 符号键
  Backquote: '`',
  Minus: '-',
  Equal: '=',
  BracketLeft: '[',
  BracketRight: ']',
  Backslash: '\\',
  Semicolon: ';',
  Quote: '\'',
  Comma: ',',
  Period: '.',
  Slash: '/',
  IntlBackslash: '\\',

  // 小键盘
  NumpadEnter: 'Enter',
  NumpadSubtract: '-',
  NumpadAdd: '+',
  NumpadDecimal: '.',
  NumpadDivide: '/',
  NumpadMultiply: '*',
}

// 修饰键配置（前缀匹配 -> 显示名称）
const modifierKeys = [
  { prefix: 'Control', display: 'Ctrl' },
  { prefix: 'Alt', display: 'Alt' },
  { prefix: 'Shift', display: 'Shift' },
  { prefix: 'Meta', display: 'Meta' },
]

export function getKeyDisplayName(code: string): string {
  // 1. 优先处理特殊映射
  if (keyDisplayMap[code])
    return keyDisplayMap[code]

  // 2. 处理字母键（KeyA -> A）
  if (code.startsWith('Key'))
    return code.slice(3)

  // 3. 处理主键盘数字键（Digit5 -> 5）
  if (code.startsWith('Digit'))
    return code.slice(5)

  // 4. 处理修饰键（ControlLeft -> Ctrl）
  for (const { prefix, display } of modifierKeys) {
    if (code.startsWith(prefix))
      return display
  }

  // 5. 处理小键盘数字（Numpad1 -> 1）
  if (code.startsWith('Numpad')) {
    const num = code.slice(6)
    return /\d/.test(num) ? num : code
  }

  // 6. 处理功能键（F1-F24）
  if (/^F[1-9]\d*$/.test(code))
    return code

  // 7. 处理媒体键（MediaPlayPause -> PlayPause）
  if (code.startsWith('Media'))
    return code.replace('Media', '')

  // 8. 通用处理：转换驼峰命名 + 移除左右标识
  return code
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(Left|Right)/gi, '')
}

export function getKey(e: KeyboardEvent) {
  let key = getKeyDisplayName(e.code)
  if (e.key !== 'Control' && e.ctrlKey)
    key = `Ctrl + ${key}`
  if (e.key !== 'Shift' && e.shiftKey)
    key = `Shift + ${key}`
  if (e.key !== 'Alt' && e.altKey)
    key = `Alt + ${key}`
  if (e.key !== 'Meta' && e.metaKey)
    key = `Meta + ${key}`
  return key
}

export function createDefaultShortcuts() {
  return [
    { key: 'Shift + 2', speed: 2 },
    { key: 'Shift + 3', speed: 3 },
  ]
}
