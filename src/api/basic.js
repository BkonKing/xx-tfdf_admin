import request from '@/utils/request'

export const basic = {
  getAppletInfo: '/basic/appletInfo',
  applet: '/basic/applet',
  getList: '/agreement/getList',
  addAgreement: '/agreement/addAgreement',
  updateAgreement: '/agreement/updateAgreement',
  agreementInfo: '/agreement/agreementInfo',
  backstageInfo: '/basic/backstageInfo',
  backstage: '/basic/backstage'
}

// 小程序设置数据接口
export function getAppletInfo (data) {
  return request({
    url: basic.getAppletInfo,
    method: 'post',
    data
  })
}

// 编辑小程序基本设置接口
export function saveApplet (data) {
  return request({
    url: basic.applet,
    method: 'post',
    data
  })
}

// 协议列表接口
export function getAgreementList (data) {
  return request({
    url: basic.getList,
    method: 'post',
    data
  })
}

// 新增协议接口
export function addAgreement (data) {
  return request({
    url: basic.addAgreement,
    method: 'post',
    data
  })
}

// 修改协议接口
export function updateAgreement (data) {
  return request({
    url: basic.updateAgreement,
    method: 'post',
    data
  })
}

// 协义详情接口
export function getAgreementInfo (data) {
  return request({
    url: basic.agreementInfo,
    method: 'post',
    data
  })
}

// 后台设置数据接口
export function getBackstageInfo (data) {
  return request({
    url: basic.backstageInfo,
    method: 'post',
    data
  })
}

// 编辑后台设置接口
export function saveBackstage (data) {
  return request({
    url: basic.backstage,
    method: 'post',
    data
  })
}
