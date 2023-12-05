import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
Vue.use(VueRouter)

//路由表
const routes = [
  {
    path:'/',
    redirect: '/login'
  },
  {
    path:'/login',
    name:'login',
    meta:{
      title:'登录'
    },
    component:()=>import('@/views/login')
  },

]

const router = new VueRouter({
  routes
})

export default router
