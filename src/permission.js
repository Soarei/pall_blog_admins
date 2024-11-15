import Vue from 'vue'
import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
NProgress.configure({ showSpinner: false }) // NProgress Configuratio
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {

  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = store.getters.token
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const permission_routes = store.getters.permission_routes && store.getters.permission_routes.length > 0 // 获取菜单
      if (permission_routes) {
        next()
      } else {
        try {
          let that = Vue.prototype
          // const { roles } = await store.dispatch('user/getInfo') //这里没有用到角色
          const accessRoutes = await store.dispatch('user/generateRoutes') // 获取该角色可以访问的菜单
          router.addRoutes(accessRoutes)
          // router.addRoutes([{ path: '*', redirect: '/', hidden: true }])
          next({ ...to, replace: true })
        } catch (error) {
          console.log(error);
          await store.dispatch('user/resetToken')
          Vue.prototype.$antmessage.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
