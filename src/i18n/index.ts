export const locales = ['zh_CN', 'zh_TW', 'en']
export const defaultLocale = 'en'

export function getLocale() {
  let locale = navigator.language.replaceAll('-', '_')
  if (locales.includes(locale))
    return locale

  locale = locale.split('_')[0]
  if (locales.includes(locale))
    return locale

  return defaultLocale
}
