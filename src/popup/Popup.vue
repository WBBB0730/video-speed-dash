<script setup lang="ts">
import { useWebExtensionStorage } from '~/composables/useWebExtensionStorage'
import { createDefaultShortcuts, getKey } from '~/utils/utils'

interface Shortcut {
  key: string
  speed: number
}

/** 快捷键列表 */
const shortcuts = useWebExtensionStorage<Shortcut[]>('shortcuts', createDefaultShortcuts())

/** 修改快捷键 */
function handleKeyChange(e: KeyboardEvent, shortcut: Shortcut) {
  shortcut.key = getKey(e)
}

/** 聚焦时自动全选 */
function handleSpeedFocus(e: FocusEvent) {
  (e.target as HTMLInputElement).select()
}

/** 修改播放速度 */
function handleSpeedChange(shortcut: Shortcut) {
  shortcut.speed = shortcut.speed ? Math.max(Math.min(shortcut.speed, 16), 0.1) : 1
}

/** 添加快捷键 */
async function handleAddShortcut() {
  shortcuts.value.push({ key: '', speed: 2 })
  await nextTick()
  const keyInputs = Array.from<HTMLInputElement>(document.querySelectorAll('input[data-key-input]'))
  keyInputs.at(-1)?.focus()

  const popupElement = document.querySelector('.popup')
  popupElement?.scrollTo({ top: popupElement.scrollHeight, behavior: 'smooth' })
}
</script>

<template>
  <main class="popup">
    <div class="shortcuts">
      <div v-for="(shortcut, index) in shortcuts" :key="index" class="shortcut">
        <div class="label">
          {{ $t('shortcut') }}
        </div>
        <input
          class="input" :value="shortcut.key" readonly data-key-input
          @keydown.prevent="(e) => handleKeyChange(e, shortcut)" @input.prevent
        />
        <div class="label">
          {{ $t('playbackSpeed') }}
        </div>
        <input
          v-model.number="shortcut.speed" class="input" type="number" :min="0.1" :max="16" :step="0.1"
          @focus="handleSpeedFocus" @change="handleSpeedChange(shortcut)"
        />
        <div class="delete" @click="shortcuts.splice(index, 1)">
          ×
        </div>
      </div>
      <button class="add" @click="handleAddShortcut()">
        {{ $t('addShortcut') }}
      </button>
    </div>
  </main>
</template>


<style lang="scss" scoped>
$primary: #ffa500;
$border: #e8e8e8;
$background: #fafafa;
$icon: #bfbfbf;

.popup {
  max-height: 400px;
  padding: 16px 10px 16px 16px;
  background-color: $background;
  overflow-y: scroll;
}

.shortcuts {
  width: 268px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.shortcut {
  position: relative;
  padding: 12px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);

  .label {
    margin-bottom: 4px;
    color: #333333;
  }

  .input {
    all: unset;
    box-sizing: border-box;
    width: 100%;
    padding: 6px 8px;
    border: 1px solid $border;
    border-radius: 8px;
    cursor: text;
    transition: all 0.2s;

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    &:focus {
      border-color: $primary;
      box-shadow: 0 0 6px rgba(255, 165, 0, 0.1);
    }
  }

  .delete {
    position: absolute;
    top: 8px;
    right: 12px;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    user-select: none;
    color: $icon;
    font-weight: 200;
  }
}

.add {
  height: 36px;
  border-radius: 8px;
  background-color: $primary;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
}
</style>
