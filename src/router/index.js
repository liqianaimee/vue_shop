import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入字体图
import '../assets/fonts/iconfont.css'
// 导入全局样式
import '../assets/css/global.css'

// 改造成路由懒加载
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome')

const Users = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/user/Users')
const Rights = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Rights')
const Roles = () => import(/* webpackChunkName: "user_rights_roles" */ '../components/power/Roles')

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params')

const List = () => import(/* webpackChunkName: "goodsList_add" */ '../components/goods/List')
const Add = () => import(/* webpackChunkName: "goodsList_add" */ '../components/goods/Add')

const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order')
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report')
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})
// 挂在路由导航守卫
router.beforeEach((to, from, next) => {
  //  to表示要访问的路径,from代表从那个路径跳转过来,next代表放行,next('/login')代表强制跳转
  if (to.path === '/login') return next()
  //  获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果没有token 强制跳转登陆页面
  if (!tokenStr) return next('/login')
  // 否则放行
  next()
})

export default router
