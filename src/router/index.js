import Vue from "vue";
import VueRouter from "vue-router";
// import Login from '../views/login/index'
// 自动导入 index.vue
import Login from "../views/login";
import Layout from '@/components/Layout'
import ElementLayout from '@/components/ElementIndexLayout'
import ElementLayout2 from '@/components/ElementIndexLayout2'
import Goods from "../views/Goods";
import Home from "../views/Home";
import Member from "../views/Member";
import Staff from "../views/Staff";
import Supplier from "../views/Supplier";


// 路由重复，浏览器控制台报红
//获取原型对象上的push函数
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const router = new VueRouter({
  // mode: "history", // 去除哈希值 #/
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "login", // 路由名称: 登录页
      component: Login
    },
    {
      path: "/",
      name: "layout", // 首页布局
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: "/home",
          component: Home,
          meta: {title: '首页'}
        }
      ]
    },
    {
      path: "/goods",
      name: "goods",
      component: Layout,
      children: [
        {
          path: "/",
          component: Goods,
          meta: {title: '商品管理'}
        }
      ]
    },
    {
      path: "/member",
      name: "member",
      component: Layout,
      children: [
        {
          path: "/",
          component: Member,
          meta: {title: '会员管理'}
        }
      ]
    },
    {
      path: "/staff",
      name: "staff",
      component: Layout,
      children: [
        {
          path: "/",
          component: Staff,
          meta: {title: '员工管理'}
        }
      ]
    },
    {
      path: "/supplier",
      name: "supplier",
      component: Layout,
      children: [
        {
          path: "/",
          component: Supplier,
          meta: {title: '供应商管理'}
        }
      ]
    },
    {
      path: "/eleLayout",
      name: "eleLayout", // ele首页布局
      component: ElementLayout
    },
    {
      path: "/eleLayout2",
      name: "eleLayout2", // ele首页布局2
      component: ElementLayout2
    }
  ]
});

export default router;
