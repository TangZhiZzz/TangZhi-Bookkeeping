import Vue from 'vue'
import App from './App'
import SvgIcon from './components/SvgIcon.vue'
import CustomNavbar from './components/CustomNavbar.vue'

// 注册全局组件
Vue.component('svg-icon', SvgIcon)
Vue.component('custom-navbar', CustomNavbar)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
