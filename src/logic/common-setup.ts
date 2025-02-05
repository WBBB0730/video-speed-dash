import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import { defaultLocale, getLocale } from '~/i18n'
import messages from '~/i18n/messages'

export function setupApp(app: App) {
  // Inject a globally available `$app` object in template
  app.config.globalProperties.$app = {
    context: '',
  }

  // Provide access to `app` in script setup with `const app = inject('app')`
  app.provide('app', app.config.globalProperties.$app)

  // Here you can install additional plugins for all contexts: popup, options page and content-script.
  // example: app.use(i18n)
  // example excluding content-script context: if (context !== 'content-script') app.use(i18n)
  const i18n = createI18n({
    locale: getLocale(),
    fallbackLocale: defaultLocale,
    messages,
  })
  app.use(i18n)
}
