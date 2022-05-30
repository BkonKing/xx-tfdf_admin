import request from '@/utils/request'

export const common = {
  getBasicData: '/common/basicData',
  getIntentionList: '/common/getIntentionList',
  basicSettings: '/common/basicSettings',
  safeSettings: '/common/safeSettings',
  getLogsList: '/common/getLogsList'
}

// 基本设置数据接口
export function getBasicData (data) {
  return request({
    url: common.getBasicData,
    method: 'post',
    data
  })
}

// 基本设置接口
export function saveBasicSettings (data) {
  return request({
    url: common.basicSettings,
    method: 'post',
    data
  })
}

// 安全设置接口
export function saveSafeSettings (data) {
  return request({
    url: common.safeSettings,
    method: 'post',
    data
  })
}

// 客户与楼盘详请页面预约记录接口
export function getIntentionList (data) {
  return request({
    url: common.getIntentionList,
    method: 'post',
    data
  })
}

// 楼盘详请页面操作日志列表接口
export function toGetLogsList (data) {
  return request({
    url: common.getLogsList,
    method: 'post',
    data
  })
}
