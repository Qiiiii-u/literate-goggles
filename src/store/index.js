import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'js-cookie'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentMenu: null,
    menu: [],
    isLogin: false, // 用户是否登录
    currentUser: null, //用户信息显示
    userInfoList: [] // 显示用户信息数据
  },
  getters: {
    getIsLogin: state => state.isLogin,
    getCurrentUser: state => state.currentUser,
    getCurrentUserList: state => state.userInfoList
  },
  mutations: { // 更改状态
    selectMenu(state, val) {
      val.name === 'Home' ? (state.currentMenu = null) : (state.currentMenu = val)
    },
    setMenu(state, val) {
      state.menu = val
      Cookie.set('menu', JSON.stringify(val))
    },
    clearMenu(state) {
      state.menu = []
      Cookie.remove('menu')
    },
    addMenu(state, router) {
      if (!Cookie.get('menu')) {
        return
      }
      let menu = JSON.parse(Cookie.get('menu'))
      state.menu = menu
      console.log(menu);
      // let currentMenu = [
      //   {
      //     path: '/Home',
      //     component: () => import('../views/Manage/Main'),
      //     meta: { title: 'KIDS PT后台管理系统', isLogin: true },
      //     children: []
      //   }
      // ]
      // menu.map(item=>{
      //   if(item.children){
      //     item.children = item.children.map(item=>{
      //       item.component = () => import('../views/Manage/${item.path}')
      //       return item
      //     })
      //     currentMenu[0].children.push(...item.children)
      //   }else{
      //     item.component = () => import('../views/Manage/${item.path}')
      //     currentMenu[0].children.push(item)
      //   }
      // })
      // console.log(currentMenu)
      // router.addRoutes(currentMenu)
    },
    userStatus(state, userList) {
      if (userList) {
        state.currentUser = userList.username
        state.isLogin = true
        state.userInfoList = userList
      } else {
        state.currentUser = null
        state.isLogin = false
        state.userInfoList = []
      }
    },
    updateUsername(state, username) {
      if (username) {
        state.currentUser = username
        state.userInfoList.username = username
      }
    }
  },
  actions: {
    setUser({
      commit
    }, userList) {
      commit("userStatus", userList)
    },
    setUsername({
      commit
    }, username) {
      commit("updateUsername", username)
    },
  },
  modules: {}
})
