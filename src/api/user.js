import request from '@/utils/request'

export const userApi = {
  Login: '/slognin/login',
  Logout: '/slognin/logout',
  UserInfo: '/common/getAccountInfo',
  workbench: '/common/workbench',
  updateBasicSet: '/account/updateBasicSet',
  updateSecuritySet: '/account/updateSecuritySet',
  UserMenu: '/common/leftMenu',
  allots: '/common/allots',
  bdCode: '/common/bdCode',
  bdStatus: '/common/bdStatus',
  uploadImg: '/uploads/uImages',
  getMessageList: '/common/getMessageList',
  getShortMessage: '/common/getShortMessage',
  readMessageById: '/common/readMessageById',
  readAllMessage: '/common/readAllMessage',
  clearMessage: '/common/clearMessage',
  getMessageCount: '/common/getMessageCount'
}

export function login (data) {
  return request({
    url: userApi.Login,
    method: 'post',
    data
  })
}

export function getInfo () {
  return request({
    url: userApi.UserInfo,
    method: 'post'
  })
}

export function updateBasicSet (data) {
  return request({
    url: userApi.updateBasicSet,
    method: 'post',
    data
  })
}

export function updateSecuritySet (data) {
  return request({
    url: userApi.updateSecuritySet,
    method: 'post',
    data
  })
}

export function getDdCode (data) {
  return request({
    url: userApi.bdCode,
    method: 'post',
    data
  })
}

export function getDdStatus (data) {
  return request({
    url: userApi.bdStatus,
    method: 'post',
    data
  })
}

export function uploadImg (data) {
  console.log(data)
  return request({
    url: userApi.uploadImg,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getMenu () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

// 前端页面权限判断接口
export function getAllots (data) {
  return request({
    url: userApi.allots,
    method: 'post',
    data
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post'
  })
}
// 获取消息列表接口(已验证)
export function toGetMessageList (params) {
  return request({
    url: userApi.getMessageList,
    params
  })
}
// 获取弹窗消息接口(已验证)
export function toGetShortMessage (params) {
  return request({
    url: userApi.getShortMessage

  })
}
// 设置消息已读接口(已验证)
export function toReadMessageById (data) {
  return request({
    url: userApi.readMessageById,
    method: 'post',
    data
  })
}
// 消息全部已读接口(已验证)
export function toReadAllMessage () {
  return request({
    url: userApi.readAllMessage

  })
}
// 清除弹窗通知接口(已验证)
export function toClearMessage (data) {
  return request({
    method: 'post',
    url: userApi.clearMessage,
    data
  })
}
// 获取弹窗消息数量接口
export function getMessageCount () {
  return request({
    url: userApi.getMessageCount
  })
}
// 工作台数据接口(已验证)
export function toWorkbench (params) {
  return request({
    url: userApi.workbench
  })
}
