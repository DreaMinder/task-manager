import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({ app, store }) => {
  let locale = localStorage.getItem('locale');
  let locales = ['en','uk','ru'];

  if(locales.indexOf(locale) === -1) {
    let userLang = navigator.language || navigator.userLanguage;
    if(locales.indexOf(userLang) !== -1)
      locale = userLang;
    else
      locale = 'en'
    localStorage.setItem('lang', locale)
  }

  store.commit('SET_LANG', locale)

  app.i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    silentTranslationWarn: true,
    messages: {
      'en': require('@/locales/en.json'),
      'uk': require('@/locales/uk.json'),
      'ru': require('@/locales/ru.json')
    }
  })
}

Vue.mixin({
  computed: {
    locale(){
      if(this.$store)
        return this.$store.state.locale
      else
        return 'en'
    }
  }
})
