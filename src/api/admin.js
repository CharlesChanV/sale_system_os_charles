import request from '@/utils/request'
/**
 * 获取用户角色列表
 * @param {*} params
 */
export async function getRoleList() {
  return request({
    url: '/admin/getRoleList',
    method: 'get',
  })
}
/**
 * 设置用户角色
 * @param {*} params
 */
export async function setUserRole(data) {
  return request({
    url: '/admin/setUserRole',
    method: 'post',
    data,
  })
}
/**
 * 删除用户角色
 * @param {*} params
 */
export async function deleteUserRole(data) {
  return request({
    url: '/admin/deleteUserRole',
    method: 'post',
    data,
  })
}
/**
 * 更新管理员信息
 * @param {*} params
 */
export async function saveAdminInfo(data) {
  return request({
    url: '/admin/saveAdminInfo',
    method: 'post',
    data,
  })
}
