import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@wangeditor/editor/dist/css/style.css'
import ElementUI from 'element-ui'
// import vcolorpicker from 'vcolorpicker'
import * as echarts from 'echarts'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import { componentsPlugin } from './libs/antd'
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control

// console.log(vcolorpicker);
// Vue.use(vcolorpicker)
Vue.use(componentsPlugin)
Vue.use(ElementUI, { locale })

// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.prototype.$echarts = echarts

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
