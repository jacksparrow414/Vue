import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.permission_routes.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 以下两行代码干的事
          // 如果有token,则去拉取用户信息,根据用户信息中的roles和路由表里的role进行对比,对比结果返回为最终的路由表,
          // 但是这样是直接把每个页面信息写死了。
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 这是原始代码:const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // 这是原始代码:const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 新代码实现思路:
          // 如果有token,则去根据token里的userID去数据库join查询,userID对应什么角色,然后把该用户角色对应的菜单查询出来,
          // 把这些信息返回给前端,前端根据返回的数据里的url等信息,再去路由表里进行匹配,这样就实现了每个页面的动态可配置。
          const accessRoutes = await store.dispatch('permission/GenerateRoutes', hasToken)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          console.log('确实进来了')
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
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
