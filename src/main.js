import Vue from 'vue'
import App from './App.vue'
import { rtdbPlugin } from 'vuefire'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import  store  from './store'
import router from './router'

Vue.use(rtdbPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
