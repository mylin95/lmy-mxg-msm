/**
 * 权限校验：
 *  Vue Router中的 前置钩子函数beforeEach(to, from, next)
 *  当进行路由跳转之前，进行判断 是否已经登录过
 *    登录过，则允许范文非登录页面
 *    否则，回到登录页
 *
 * to: 即将 进入 的目标路由对象
 * from: 即将 离开 的目标路由对象
 * next: 是一个方法，可以指定路由地址，进行路由跳转
 */

import router from './index'
import { getUserInfo } from "../api/login";

router.beforeEach((to, from, next) => {
  // 1.获取token
  const token = localStorage.getItem('mxg-msm-token')

  if (!token) {
    // 1.1 如果没有获取到token
    //  访问 非登录页  =》 跳转登录页，重新登录
    //  访问 登录页    =》 放行
    if (to.path !== '/login') {
      next({path: '/login'})
    } else {
      next()
    }
  } else {
    // 1.2 已经获取到token
    //  1.2.1 访问 登录页  =》 放行
    if (to.path === '/login') {
      next()
    } else {
      // 1.2.2 访问 非登录页 ，需要先查看本地是否有 用户信息
      const userInfo = localStorage.getItem('mxg-msm-user')
      if (userInfo) {
        // 本地有 用户信息 =》 放行
        next()
      } else {
        // 本地没有 用户信息, 先通过token获取 用户信息
        getUserInfo(token).then(response => {
          const resp = response.data
          if (resp.flag) {
            // 远端获取到 用户信息 =》 设置缓存，放行
            localStorage.setItem('mxg-msm-user', JSON.stringify(resp.data))
            next()
          } else {
            // 远端没有获取到 用户信息 =》 跳转登录页，重新登录
            next({path: '/login'})
          }
        })
      }
    }
  }
})
