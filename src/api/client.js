import request from '@/utils/request'

export const client = {
  getList: '/user/getList',
  addBatchUser: '/user/addBatchUser',
  updateUser: '/user/updateUser',
  removeUser: '/user/removeUser',
  removeBatchUser: '/user/removeBatchUser',
  updateBatchUtype: '/user/updateBatchUtype',
  updateBatchRemarks: '/user/updateBatchRemarks',
  userInfo: '/user/userInfo',
  importUser: '/user/importUser',
  exportUser: '/user/exportUser'
}

// 客户列表接口
export function getList (data) {
  return request({
    url: client.getList,
    method: 'post',
    data
  })
}

// 批量新增用户接口
export function addBatchUser (data) {
  return request({
    url: client.addBatchUser,
    method: 'post',
    data
  })
}

// 修改用户接口
export function updateUser (data) {
  return request({
    url: client.updateUser,
    method: 'post',
    data
  })
}

// 删除用户接口
export function removeUser (data) {
  return request({
    url: client.removeUser,
    method: 'post',
    data
  })
}

// 批量删除用户接口
export function removeBatchUser (data) {
  return request({
    url: client.removeBatchUser,
    method: 'post',
    data
  })
}

// 批量修改用户类型接口
export function updateBatchUtype (data) {
  return request({
    url: client.updateBatchUtype,
    method: 'post',
    data
  })
}

// 客户详情数据接口
export function getUserInfo (data) {
  return request({
    url: client.userInfo,
    method: 'post',
    data
  })
}

// 批量修改用户备注接口
export function updateBatchRemarks (data) {
  return request({
    url: client.updateBatchRemarks,
    method: 'post',
    data
  })
}

// 导入客户接口
export function importUser (data) {
  return request({
    url: client.importUser,
    method: 'post',
    data
  })
}

// 导出客户接口
export function exportUser (data) {
  return request({
    url: client.exportUser,
    method: 'post',
    data
  })
}
