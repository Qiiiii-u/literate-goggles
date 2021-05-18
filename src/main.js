import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import './assets/icon/iconfont.css'

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import vuescroll from 'vuescroll'
require('vuescroll/dist/vuescroll.css')
Vue.use(vuescroll)

import VEmojiPicker from 'v-emoji-picker'
Vue.use(VEmojiPicker)

Vue.config.productionTip = false



import * as re_home from './network/manage/home.js'
router.afterEach((to, from, next) => {
  re_home.addViews().then(res => {

  })
})

router.beforeEach((to, from, next) => { // bug：刷新不起作用
  window.document.title = to.meta.title
  // store.commit('getlocal')
  //获取用户登录成功后储存的登录标志
  let getFlag = localStorage.getItem("Flag")
  let getUserinfo = JSON.parse(localStorage.getItem('Userinfo'))

  //如果登录标志存在且为isLogin，即用户已登录
  if (getFlag === "isLogin") {

    //设置vuex登录状态为已登录
    store.state.isLogin = true
    store.state.currentUser = getUserinfo.username
    store.state.userInfoList = getUserinfo

    next()
    //如果登录标志不存在，即未登录
  } else {
    if (store.state.isLogin == true) {
      next()
    } else if (to.meta.isLogin) { //用户想进入需要登录的页面，则定向回登录界面
      next({
        path: '/login',
      })

      //用户进入无需登录的界面，则跳转继续
    } else {
      next()
    }

  }

});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
