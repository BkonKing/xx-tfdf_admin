import request from '@/utils/request'

export const common = {
  getList: '/project/getList',
  addProject: '/project/addProject',
  updateProject: '/project/updateProject',
  removeProject: '/project/removeProject',
  sellOutProject: '/project/sellOutProject',
  removeBatchProject: '/project/removeBatchProject',
  sellOutBatchProject: '/project/sellOutBatchProject',
  sellBatchProject: '/project/sellBatchProject',
  getProjectInfo: '/project/projectInfo',
  updateProjectOrder: '/project/updateProjectOrder'
}

// 楼盘列表接口
export function getList (data) {
  return request({
    url: common.getList,
    method: 'post',
    data
  })
}

// 新增楼盘接口
export function addProject (data) {
  return request({
    url: common.addProject,
    method: 'post',
    data
  })
}

// 修改楼盘接口
export function updateProject (data) {
  return request({
    url: common.updateProject,
    method: 'post',
    data
  })
}

// 删除楼盘接口
export function removeProject (data) {
  return request({
    url: common.removeProject,
    method: 'post',
    data
  })
}

// 售罄楼盘接口
export function sellOutProject (data) {
  return request({
    url: common.sellOutProject,
    method: 'post',
    data
  })
}

// 批量删除楼盘接口
export function removeBatchProject (data) {
  return request({
    url: common.removeBatchProject,
    method: 'post',
    data
  })
}

// 批量售罄楼盘接口
export function sellOutBatchProject (data) {
  return request({
    url: common.sellOutBatchProject,
    method: 'post',
    data
  })
}

// 批量在售楼盘接口
export function sellBatchProject (data) {
  return request({
    url: common.sellBatchProject,
    method: 'post',
    data
  })
}

// 楼盘详情数据接口
export function getProjectInfo (data) {
  return request({
    url: common.getProjectInfo,
    method: 'post',
    data
  })
}

// 修改楼盘排序接口
export function updateProjectOrder (data) {
  return request({
    url: common.updateProjectOrder,
    method: 'post',
    data
  })
}
