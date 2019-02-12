//导入Vue
import Vue from 'vue'
//导入Vue-Router
import VueRouter from 'vue-router'

//集成VueRouter中间件
Vue.use(VueRouter)

//导入组件
import Login from '../components/account/Login'
import Layout from '../components/layout/Layout'
import Users from '../components/users/Users'
import Welcome from '../components/welcome/Welcome'
import Permissions from '../components/permissions/Permissions'

//创建路由对象，导出去
const router = new VueRouter({
    routes:[
        {path:'/',redirect:'/login'},
        {path:'/login',meta:{unRequiresAuth:true},component:Login},
        {path:'/layout',name:'layout',component:Layout,children:[
            {path:'',component:Welcome},
            // 嵌套路由中的path前面不要加/
            {path:'users',component:Users},
            // 权限列表
            {path:'2-2',component:Permissions}
        ]} // name 相当于这条路由规则的小名
    ]
})

// 导航守卫
router.beforeEach((to, from, next) => {
    // ...
    if(to.meta.unRequiresAuth){
        next()
    }else{
        if(localStorage.getItem('mytoken')){
            next()
        }else{
            router.push('/login')
        }
    }
    
  })

//es6导出
export default router