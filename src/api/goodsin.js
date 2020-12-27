import request from '@/utils/request'
/**
 * 获取进货单列表
 * @param {*} params
 */
export async function getGoodsInList(params) {
  return request({
    url: '/goodsIn',
    method: 'get',
    params,
  })
}
/**
 * 通过ID获取进货单信息
 * @param {*} id
 */
export async function getGoodsInById(id) {
  return request({
    url: `/goodsIn/${id}`,
    method: 'get',
    // params,
  })
}
/**
 * 更新进货单信息
 * @param {*} data
 */
export async function updateGoodsIn(data) {
  return request({
    url: `/goodsIn`,
    method: 'put',
    data,
  })
}

/**
 * 删除进货单信息
 * @param {*} data
 */
export async function deleteGoodsInById(id) {
  return request({
    url: `/goodsIn/${id}`,
    method: 'post',
  })
}

/**
 * 新增进货单
 * @param {*} data
 */
export async function saveGoodsIn(data) {
  return request({
    url: `/goodsIn`,
    method: 'post',
    data,
  })
}
