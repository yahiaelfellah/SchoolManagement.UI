import { defineStore } from 'pinia'
import { ref } from 'vue'
import { setI18nLocale, type LocaleType } from '../i18n'

export const useSettingsStore = defineStore('settings', () => {
  const locale = ref<LocaleType>((localStorage.getItem('locale') as LocaleType) || 'en')
  const direction = ref(locale.value === 'ar' ? 'rtl' : 'ltr')

  const setLocale = async (lang: LocaleType) => {
    locale.value = lang
    direction.value = lang === 'ar' ? 'rtl' : 'ltr'
    await setI18nLocale(lang)
  }

  return { locale, direction, setLocale }
})
