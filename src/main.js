import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 字体图标的引入
import './assets/styles/icon.css'
// web字体的引入
// import './assets/fonts/daysOne.css'
import './assets/fonts/droidSans.css'

import './assets/styles/globle.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
