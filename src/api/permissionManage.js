import request from '@/utils/request'

export const permissionApi = {
  toGetRoles: '/common/listTreeMin',
  getRoles: '/roles/getRoles',
  getAllotsMenus: '/roles/getAllotsMenus',
  updateBatchRole: '/roles/updateBatchRole',
  removeBatchRole: '/roles/removeBatchRole',
  removeRole: '/roles/removeRole',
  updateAllotsMenus: '/roles/updateAllotsMenus',
  getAdminList: '/account/getList',
  addAdmin: '/account/addAdmin',
  removeAdmin: '/account/removeAdmin',
  updateAdmin: '/account/updateAdmin',
  getAdminMenus: '/account/getAllotsMenus',
  updateAdminMenus: '/account/updateAllotsMenus',
  getAllRoles: '/common/getAllRoles',
  getAllProject: '/common/getAllProject',
  getLogsList: '/logs/getList',
  getLogType: '/common/getLogType',
  getLogAdmin: '/common/allAdmin',
  getMenus: '/menus/getMenus',
  updateBatchMenu: '/menus/updateBatchMenu',
  removeMenu: '/menus/removeMenu',
  removeBatchMenu: '/menus/removeBatchMenu'
}
// 角色管理接口
export function getRoles () {
  return request({
    url: permissionApi.getRoles,
    method: 'post'
  })
}
// 角色管理接口
export function toGetRoles () {
  return request({
    url: permissionApi.toGetRoles,
    method: 'post'
  })
}
// 批量添加/编辑角色接口
export function toUpdateBatchRole (data) {
  return request({
    url: permissionApi.updateBatchRole,
    method: 'post',
    data
  })
}
// 批量删除角色接口
export function toRemoveBatchRole (data) {
  return request({
    url: permissionApi.removeBatchRole,
    method: 'post',
    data
  })
}
// 删除角色接口
export function toRemoveRole (data) {
  return request({
    url: permissionApi.removeRole,
    method: 'post',
    data
  })
}
// 角色对应的菜单数据接口
export function toGetAllotsMenus (data) {
  return request({
    url: permissionApi.getAllotsMenus,
    method: 'post',
    data
  })
}
// 配置角色对应的权限接口
export function toUpdateAllotsMenus (data) {
  return request({
    url: permissionApi.updateAllotsMenus,
    method: 'post',
    data
  })
}
// 人员列表接口
export function toGetAdminList (data) {
  return request({
    url: permissionApi.getAdminList,
    method: 'post',
    data
  })
}

// 新增人员接口
export function toAddAdmin (data) {
  return request({
    url: permissionApi.addAdmin,
    method: 'post',
    data
  })
}
// 删除人员接口
export function toRemoveAdmin (data) {
  return request({
    url: permissionApi.removeAdmin,
    method: 'post',
    data
  })
}
// 修改人员接口
export function toUpdateAdmin (data) {
  return request({
    url: permissionApi.updateAdmin,
    method: 'post',
    data
  })
}
// 管理员对应的菜单数据接口
export function toGetAdminMenus (data) {
  return request({
    url: permissionApi.getAdminMenus,
    method: 'post',
    data
  })
}
// 配置管理员对应的权限接口
export function toUpdateAdminMenus (data) {
  return request({
    url: permissionApi.updateAdminMenus,
    method: 'post',
    data
  })
}
// 获取所有角色接口
export function getAllRoles () {
  return request({
    url: permissionApi.getAllRoles,
    method: 'post'
  })
}
// 所有项目接口
export function toGetAllProject (data) {
  return request({
    url: permissionApi.getAllProject,
    method: 'post',
    data
  })
}
// 操作日志列表接口
export function toGetLogsList (data) {
  return request({
    url: permissionApi.getLogsList,
    method: 'post',
    data
  })
}
// 操作日志模块接口
export function toGetLogType (data) {
  return request({
    url: permissionApi.getLogType,
    method: 'post',
    data
  })
}
// 日志操作员接口
export function toGetLogAdmin () {
  return request({
    url: permissionApi.getLogAdmin
  })
}
// 后台菜单管理对象接口
export function toGetMenus (data) {
  return request({
    url: permissionApi.getMenus,
    data
  })
}
// 批量添加/编辑菜单接口
export function toUpdateBatchMenu (data) {
  console.log(data)
  return request({
    url: permissionApi.updateBatchMenu,
    method: 'post',
    data
  })
}
// 删除菜单接口
export function toRemoveMenu (data) {
  return request({
    url: permissionApi.removeMenu,
    method: 'post',
    data
  })
}
// 批量删除菜单接口
export function toRemoveBatchMenu (data) {
  return request({
    url: permissionApi.removeBatchMenu,
    method: 'post',
    data
  })
}
