import request from '@/utils/request'
/**
 * 获取商品列表
 * @param {*} params
 */
export async function getGoodsList(params) {
  return request({
    url: '/goods',
    method: 'get',
    params,
  })
}
/**
 * 通过ID获取商品信息
 * @param {*} id
 */
export async function getGoodsById(id) {
  return request({
    url: `/goods/${id}`,
    method: 'get',
    // params,
  })
}
/**
 * 更新商品信息
 * @param {*} data
 */
export async function updateGoods(data) {
  return request({
    url: `/goods`,
    method: 'put',
    data,
  })
}

/**
 * 删除商品信息
 * @param {*} data
 */
export async function deleteGoodsById(id) {
  return request({
    url: `/goods/${id}`,
    method: 'post',
  })
}

/**
 * 商品新增商品
 * @param {*} data
 */
export async function saveGoods(data) {
  return request({
    url: `/goods`,
    method: 'post',
    data,
  })
}
