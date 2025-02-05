import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { createDefaultShortcuts, getKey } from '~/utils/utils'

/** 快捷键列表 */
const shortcuts = useWebExtensionStorage('shortcuts', createDefaultShortcuts())

/** 是否正在倍速播放 */
let isActive = false

/** 视频的原速度 */
const originSpeedMap = new WeakMap<HTMLVideoElement, number>()

/** 倍速播放 */
function handleSpeedUp(speed: number) {
  const videos = Array.from(document.querySelectorAll('video'))

  if (!isActive) {
    isActive = true
    for (const video of videos) {
      originSpeedMap.set(video, video.playbackRate)
    }
  }

  for (const video of videos) {
    video.playbackRate = speed
  }
}

/** 重置速度 */
function handleSpeedReset() {
  if (!isActive)
    return

  const videos = Array.from(document.querySelectorAll('video'))

  for (const video of videos) {
    video.playbackRate = originSpeedMap.get(video) || 1
    originSpeedMap.delete(video)
  }

  isActive = false
}

/** 监听键盘按下 */
document.addEventListener('keydown', (e) => {
  if ((e.target as HTMLElement).matches('input, textarea, [contenteditable]'))
    return

  const key = getKey(e)
  for (const shortcut of shortcuts.value) {
    if (key === shortcut.key) {
      e.preventDefault()
      e.stopImmediatePropagation()
      handleSpeedUp(shortcut.speed)
      return
    }
  }
})

/** 监听键盘松开 */
document.addEventListener('keyup', () => {
  handleSpeedReset()
})
