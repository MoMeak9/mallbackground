import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/main.scss'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    next()
  } else if (to.path === '/login') {
    document.title = to.meta.title
    next()
  }
  else if (to.path === '/home') {
    document.title = to.meta.title
    next()
  } else {
    next({path: '/'})
  }
})

import axios from 'axios'
Vue.prototype.$axios = axios;

import qs from 'qs'
Vue.prototype.$qs = qs;
