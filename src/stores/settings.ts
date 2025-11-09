import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { setI18nLocale, type LocaleType } from '../i18n'

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<LocaleType>((localStorage.getItem('locale') as LocaleType) || 'en')
  const direction = ref(locale.value === 'ar' ? 'rtl' : 'ltr')

  const setLocale = async (lang: LocaleType) => {
    locale.value = lang
    direction.value = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('locale', lang)
    await setI18nLocale(lang)
  }

  // Watch locale to update direction and i18n
  watch(locale, (lang) => {
    direction.value = lang === 'ar' ? 'rtl' : 'ltr'
    document.dir = direction.value
    setI18nLocale(lang)
  }, { immediate: true })

  // Optional: watch direction separately if you ever set it independently
  watch(direction, (dir) => {
    document.dir = dir
  }, { immediate: true })

  return { locale, direction, setLocale }
})
