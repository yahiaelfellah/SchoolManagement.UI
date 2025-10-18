import { createI18n } from 'vue-i18n'
import { loadLocaleMessages, type LocaleType } from './locales'

const defaultLocale = (localStorage.getItem('locale') || 'en') as LocaleType

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {},
})

export async function setI18nLocale(locale: LocaleType) {
  const messages = await loadLocaleMessages(locale)
  i18n.global.setLocaleMessage(locale, messages)
  i18n.global.locale.value = locale
  document.dir = locale === 'ar' ? 'rtl' : 'ltr'
  localStorage.setItem('locale', locale)
}
