import Vue from "vue";
import VueRouter from "vue-router";
// import Login from '../views/login/index'
// 自动导入 index.vue
import Login from "../views/login";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login", // 路由名称
    component: Login
  }
];

const router = new VueRouter({
  // mode: "history", // 去除哈希值 #/
  base: process.env.BASE_URL,
  routes
});

export default router;
