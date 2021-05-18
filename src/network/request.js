import axios from 'axios'
import Qs from 'qs'

let loadingInstance = null;
const {
    Loading,
    Message
} = require('element-ui');

export function request(config) {
  // 1.创建实例
  const instance = axios.create({
    baseURL: 'http://www.train.com/index.php/index/',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'post',
    transformRequest: [function(data) {
      return Qs.stringify(data)
    }],
  })
  // 2.拦截器
  instance.interceptors.request.use(config => {
    // 1.比如config中的信息不符合服务器要求headers
    // 2.比如每次发送网络请求时，都希望界面中显示一个请求的图标loading
    // 3.比如某些发送网络请求时，如登录（token)，必须携带一些特殊的信息
    loadingInstance = Loading.service({
      text: "Loading...",
      spinner: 'el-icon-loading'
    })
    return config
  }, err => {
    loadingInstance.close()
    Message({
      showClose: true,
      message: '请求错误，请您稍后重试！',
      type: 'error'
    })
    return err
  })

  // 响应拦截
  instance.interceptors.response.use(res => {
    console.log(res)
    loadingInstance.close()
    return res
  }, err => {
    Message({
      showClose: true,
      message: '请求错误，请您稍后重试！',
      type: 'error'
    })
    loadingInstance.close()
    // switch (error.response.status) {
    //   case 401: //未登录,从哪里来回哪里去
    //     router.replace({
    //       path: '/index',
    //       query: {
    //         redirect: router.currentRoute.fullPath
    //       }
    //     });
    //     break;
    //   case 403: //token过期
    //     Message({
    //       message: '登录过期，请重新登录',
    //       duration: 1500
    //     });
    //     localStorage.removeItem("apiToken"); //清除token
    //     store.commit("loginSuccess", ""); //全局通知loginSuccess为空
    //     break;
    //   case 404:
    //     Message({
    //       message: '网络请求不存在',
    //       duration: 1500
    //     });
    //     break;
    //   case 500, 501, 503: //服务端错误
    //     Message({
    //       message: '请求异常，请您稍后重试！',
    //       duration: 1500
    //     });
    //     break;
    //   default:
    //     Message({
    //       message: error.response.data.message,
    //       duration: 1500
    //     });
    //     break;
    // }
    console.log(err)
    return err
  })

  return instance(config)
}
