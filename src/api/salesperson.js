import request from '@/utils/request'

export async function getSalespersonList(params) {
  return request({
    url: '/salesperson',
    method: 'get',
    params,
  })
}

export async function getSalespersonById(id) {
  return request({
    url: `/salesperson/${id}`,
    method: 'get',
    // params,
  })
}

/**
 * 新增销售人员信息
 * @param {*} data
 */
export async function saveSalesperson(data) {
  return request({
    url: `/salesperson`,
    method: 'post',
    data,
  })
}

/**
 * 更新销售人员信息
 * @param {*} data
 */
export async function updateSalesperson(data) {
  return request({
    url: `/salesperson`,
    method: 'put',
    data,
  })
}

/**
 * 删除销售人员信息
 * @param {*} id
 */
export async function deleteSalespersonById(id) {
  return request({
    url: `/salesperson/${id}`,
    method: 'post',
  })
}
