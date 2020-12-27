import request from '@/utils/request'

export async function getCustomerList(params) {
  return request({
    url: '/customer',
    method: 'get',
    params,
  })
}

export async function getCustomerById(id) {
  return request({
    url: `/customer/${id}`,
    method: 'get',
    // params,
  })
}

/**
 * 新增客户信息
 * @param {*} data
 */
export async function saveCustomer(data) {
  return request({
    url: `/customer`,
    method: 'post',
    data,
  })
}

/**
 * 更新客户信息
 * @param {*} data
 */
export async function updateCustomer(data) {
  return request({
    url: `/customer`,
    method: 'put',
    data,
  })
}

/**
 * 删除客户信息
 * @param {*} id
 */
export async function deleteCustomerById(id) {
  return request({
    url: `/customer/${id}`,
    method: 'post',
  })
}
