import Vue from 'vue'
import App from './App'
import globalData from './globalData.js'
Vue.config.productionTip = false
Vue.prototype.globalData = globalData
Vue.prototype.$staticImgs = globalData.staticImgs
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
