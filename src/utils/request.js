import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 3000000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
      config.headers['source'] = 'PC'
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    let that = Vue.prototype
    if (res.code != 5200) {

      that.$antmessage.error(res.message || '服务器开小差了')
      if (res.code == 1001) {
        that.$antconfirm({
          title: "提示",
          content: "账号信息已过期，请重新登录?",
          okText: "确定",
          cancelText: "取消",
          onOk() {
            store.dispatch('user/resetToken').then(() => {
              location.reload()
            })
          }
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    that.$antmessage.error(error.message || '服务器开小差了')
    return Promise.reject(error)
  }
)

export default service
