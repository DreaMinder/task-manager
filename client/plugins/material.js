import Vue from 'vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: 'teal',
  accent: 'pink',
  warn: 'red',
  background: 'white'
})
