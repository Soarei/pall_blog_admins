import { logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserInfo, setUserMenus, getUserMenus, clearUserMenus, getUserInfoStore } from '@/utils/auth'
import { resetRouter, constantRoutes } from '@/router'
import { pallLogin, getUserInfo } from '@/api/login'
import Layout from '@/layout'
const getDefaultState = () => {
  return {
    token: getToken(),
    user_info: getUserInfoStore(),
    addRoutes: [],
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  SET_USERINFO: (state, userinfo) => {
    state.user_info = userinfo
  },
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  CLEAR_ROUTES: (state) => {
    state.addRoutes = []
    state.routes = []
    state.token = ''
    state.shop_id = ''
    state.userInfo = null
    clearUserMenus()
    removeToken()
    resetRouter()
  }
}
// 把后台的菜单处理树形的三级菜单
function menu(data) {
  data.forEach((item, index) => {
    const hasIndex = data.findIndex((item2, index2) => {
      return item2.id === item.parentId
    })
    if (hasIndex > -1) {
      if (data[hasIndex].children) {
        data[hasIndex].children.push(item)
      } else {
        data[hasIndex].children = [item]
      }
    }
  })
  var newMenu = data.filter(item => {
    return item.parentId === 0
  })
  return newMenu
}
const actions = {
  // user login
  login({ commit }, userInfo) {
    const { user_account, password } = userInfo
    return new Promise((resolve, reject) => {
      pallLogin({ user_account: user_account.trim(), password }).then(response => {
        const data = response.data
        commit('SET_TOKEN', data.jwt)
        commit('SET_USERINFO', data.user_info)
        setToken(data.jwt)
        setUserInfo(JSON.stringify(data.user_info))
        // 存取用户的菜单信息
        setUserMenus(menu(data.perission))
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        const data = response.result
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        const { name, avatar } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    commit('CLEAR_ROUTES')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },
  // 对后台获取的菜单的数据处理
  generateRoutes({ commit }) { // 如果需要后台来控制菜单，就在这里异步通过role来获取可以访问的菜单
    return new Promise(resolve => {
      // 修改的
      const accessedRoutes = getUserMenus() // 获取存到localstorage里面的菜单
      function dealMenu(arr) {
        arr.forEach((item, index) => {
          item.meta = {}
          item.meta.title = item.name
          // 是否设置了icon
          // item.meta.icon = item.icon ? item.icon : 'el-icon-sold-out'
          item.path = item.routeUrl
          item.meta.icon = item.icon ? item.icon : ''
          // 是否设置了隐藏菜单
          if (item.hidden == '1') item.hidden = true
          if (item.children && item.children.length > 0) {
            dealMenu(item.children)
          }
          if (item.parentId == 0) {
            item.component = Layout
            item.redirect = item.children[0].path
            // obj.redirect = item.url
          } else {
            item.component = (reslove) => require([`@/views/${item.url}`], reslove)
          }
        })
      }
      dealMenu(accessedRoutes)
      commit('SET_ROUTES', accessedRoutes)
      console.log(accessedRoutes);

      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

