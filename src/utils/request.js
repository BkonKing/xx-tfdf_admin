import axios from 'axios'
import store from '@/store'
import storage from 'store'
// import Cookies from 'js-cookie'
import notification from 'ant-design-vue/es/notification'
import { Message } from 'ant-design-vue'
import Vue from 'vue'
import router from '@/router'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL ? process.env.VUE_APP_API_BASE_URL : '/api',
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  console.log(error.response)
  if (error.response) {
    const data = error.response.data
    Message.error(data.msg)
    if (error.response.status === 401) {
      storage.remove('access_token')
      store.commit('setLogout', true)
      router.push({ name: 'login' })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  // console.log('config', config.headers.isLoading)
  if (config.headers.isLoading) {
    Vue.prototype.$loading.show()
  }
  const token = storage.get('access_token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  Vue.prototype.$loading.hide()
  // const token = storage.get('access_token')
  const {
    data,
    config
  } = response
  const {
    code,
    msg: message
  } = data
  if (+code === 401) {
    if (router.currentRoute.name !== 'login') {
      storage.remove('access_token')
      store.commit('setLogout', true)
      router.push({ name: 'login' })
    }
  } else if (code != 200) {
    if (!config.headers.noToast) {
      Message.error(message)
    }
    return Promise.reject(data || 'Error')
  }
  return response.data
}, errorHandler)

export default request
