// ES6中导入模块的写法，跟CommonJS不一样
/**
 * const Vue = require('vue')
 */
import Vue from 'vue'
// App.vue称之为根组件
import App from './App.vue'

Vue.config.productionTip = false

//导入ElementUI及样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI) //Vue.propertype.$message = ElementUI的Message组件

// 导入路由对象
import router from './router'

// 导入axios进Vue的原型中
import axios from 'axios'

// 设置基准路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios;

// 添加请求拦截器// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  if(localStorage.getItem('mytoken')){
  config.headers.Authorization = localStorage.getItem('mytoken')
  }

  // 在发送请求之前做些什么
  return config;
}, function (error) {
  
  // 对请求错误做些什么
  return Promise.reject(error);
});



/**
 * 使用根实例，去渲染根组件到id=app的地方
 */
new Vue({
  // 渲染根组件，让用户在浏览器中能看到
  render: h => h(App),
  router // 注入到根实例
}).$mount('#app')
