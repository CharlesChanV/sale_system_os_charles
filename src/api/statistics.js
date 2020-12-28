import request from '@/utils/request'

export async function getBaseStatistics() {
  return request({
    url: '/statistics',
    method: 'get',
  })
}
export async function searchStatistics(params) {
  return request({
    url: '/statistics/search',
    method: 'get',
    params,
  })
}
export async function searchGoodsStatistics(goodsId) {
  return request({
    url: `/statistics/goods/${goodsId}`,
    method: 'get',
  })
}
