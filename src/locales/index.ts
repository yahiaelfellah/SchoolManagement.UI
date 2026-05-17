export const availableLocales = ['en', 'ar'] as const
export type LocaleType = typeof availableLocales[number]

export async function loadLocaleMessages(locale: LocaleType) {
  switch (locale) {
    case 'ar':
      return (await import('./ar')).default
    case 'en':
    default:
      return (await import('./en')).default
  }
}
