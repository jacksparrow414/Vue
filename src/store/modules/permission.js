import { asyncRoutes, constantRoutes } from '@/router'
import { getInfo } from '@/api/user'

const _import = require('@/router/import-test')

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

// 以上为老代码判断逻辑,下面的是新代码的逻辑

function getAsyncMenu(menus) {
  const routers = []
  if (menus && menus.length > 0) {
    menus.forEach(menu => {
      const menuItem = {}
      menuItem.path = menu.path
      menuItem.name = menu.name
      if (menu.icon) {
        menuItem.meta = {
          title: menu.title,
          icon: menu.icon
        }
        menuItem.component = () => import('@/layout')
      } else {
        menuItem.meta = {
          title: menu.title
          // icon: menuItem.icon
        }
        // const dhhk = 'table'
        // 这里是可以用变量替换的
        menuItem.component = _import(menu.component)
        // 这里两个import如果是变量替换的形式,只有上面这种才可以是动态的,下面这种如果路径用变量替换,会报错,具体区别在哪里还不清楚,路径只能写死
        // menuItem.component = () => import('@/views/' + dhhk + '/' + 'dynamic-table/index')
        // 全是常量才可以
        // menuItem.component = () => import('@/views/tables' + 'dynamic-table/index')
      }
      if (menu.children) {
        // menuItem.alwaysShow = true
        menuItem.children = getAsyncMenu(menu.children)
      }
      routers.push(menuItem)
    })
  }
  return routers
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  // 以上代码为老代码,下面为新代码
  GenerateRoutes({ commit }, token) {
    return new Promise((resolve, reject) => {
      // 拿到token去后台请求用户权限范围内的列表
      getInfo(token).then(response => {
        const backData = response.data
        if (backData && backData.length > 0) {
          const asyncRouter = getAsyncMenu(backData)
          commit('SET_ROUTES', asyncRouter)
          resolve(state.routes)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
