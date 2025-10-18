import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const direction = ref<'ltr' | 'rtl'>('ltr')

  const toggleDirection = () => {
    direction.value = direction.value === 'ltr' ? 'rtl' : 'ltr'
    document.dir = direction.value // Update HTML dir attribute
  }

  return { direction, toggleDirection }
})
