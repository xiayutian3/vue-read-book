import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 国际化
import i18n from './lang'

// 字体图标的引入
import './assets/styles/icon.css'
// web字体的引入
// import './assets/fonts/daysOne.css'
import './assets/fonts/droidSans.css'

import './assets/styles/globle.scss'
// mock不能下载blob，电子书类文件，可以在vue.config中设置第二种mock方法
// import '@/mock'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
