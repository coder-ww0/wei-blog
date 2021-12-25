
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 导入公共样式
import './styles/global.scss'
// 注册过滤器的最佳实践
import * as filters from './filters';
Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key]);
})

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif