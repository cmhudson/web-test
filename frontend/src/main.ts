import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuexStore from './vuexStore'

Vue.config.productionTip = false

new Vue({
  router,
  store: vuexStore,
  render: h => h(App)
}).$mount('#app')
