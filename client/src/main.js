import Vue from 'vue'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-teal.css'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'
import vuexI18n from 'vuex-i18n';
import Toasted from 'vue-toasted';
import moment from 'vue-moment'
//import {} from 'moment/locale/en-gb';
//import {} from 'moment/locale/uk';
import {} from 'moment/locale/ru';
import { sync } from 'vuex-router-sync';

import App from './App'
import { store } from './store'
import router from './router'
import localeEn from './locales/en.json'
import localeRu from './locales/ru.json'
import localeUk from './locales/uk.json'

Vue.use(vuexI18n.plugin, store);
Vue.use(VueMaterial)
Vue.use(MuseUI)
Vue.use(moment)
Vue.use(Toasted)

Vue.config.productionTip = false

Vue.i18n.add('en', localeEn);
Vue.i18n.add('uk', localeUk);
Vue.i18n.add('ru', localeRu);

Vue.material.registerTheme('default', {
  primary: 'teal',
  accent: 'pink',
  warn: 'red',
  background: 'white'
})

let lang = localStorage.getItem('lang');
if(!Vue.i18n.localeExists(lang)) {
  var userLang = navigator.language || navigator.userLanguage;
  if(Vue.i18n.localeExists(userLang))
    lang = userLang;
  else
    lang = 'en'
  localStorage.setItem('lang',lang)
}
Vue.i18n.set(lang)
//this.$moment().locale('uk');

sync(store,router);

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
