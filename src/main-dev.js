import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入Nprogress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // 在 request拦截器中显示进度条
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  // 在 response拦截器中隐藏进度条
  NProgress.done()
  return config
})

Vue.prototype.$http = axios
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)

Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + '' + 1).padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
