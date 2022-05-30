import request from '@/utils/request'

export const common = {
  getList: '/intention/getList',
  updateIntention: '/intention/updateIntention',
  updateIntentionStatus: '/intention/updateIntentionStatus',
  updateBatchStatus: '/intention/updateBatchStatus',
  getAllProject: '/common/allProject',
  exportIntention: '/intention/exportIntention'
}

// 预约记录接口
export function getList (data) {
  return request({
    url: common.getList,
    method: 'post',
    data
  })
}

// 修改预约接口
export function updateIntention (data) {
  return request({
    url: common.updateIntention,
    method: 'post',
    data
  })
}

// 修改预约取消/结束接口
export function updateIntentionStatus (data) {
  return request({
    url: common.updateIntentionStatus,
    method: 'post',
    data
  })
}

// 批量修改预约取消/结束接口
export function updateBatchStatus (data) {
  return request({
    url: common.updateBatchStatus,
    method: 'post',
    data
  })
}

// 后台下拉选择所有楼盘接口
export function getAllProject (data) {
  return request({
    url: common.getAllProject,
    method: 'post',
    data
  })
}

// 导出预约接口
export function exportIntention (data) {
  return request({
    url: common.exportIntention,
    method: 'post',
    data
  })
}
