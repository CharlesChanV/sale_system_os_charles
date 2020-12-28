import request from '@/utils/request'
/**
 * 获取物流列表
 * @param {*} params
 */
export async function getLogisticsList(params) {
  return request({
    url: '/logistics',
    method: 'get',
    params,
  })
}
/**
 * 通过ID获取物流信息
 * @param {*} id
 */
export async function getLogisticsById(id) {
  return request({
    url: `/logistics/${id}`,
    method: 'get',
    // params,
  })
}
