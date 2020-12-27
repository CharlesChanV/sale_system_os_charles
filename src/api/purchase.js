import request from '@/utils/request'
/**
 * 获取采购清单列表
 * @param {*} params
 */
export async function getPurchaseList(params) {
  return request({
    url: '/purchase',
    method: 'get',
    params,
  })
}
/**
 * 通过ID获取采购清单信息
 * @param {*} id
 */
export async function getPurchaseById(id) {
  return request({
    url: `/purchase/${id}`,
    method: 'get',
    // params,
  })
}
/**
 * 更新采购清单信息
 * @param {*} data
 */
export async function updatePurchase(data) {
  return request({
    url: `/purchase`,
    method: 'put',
    data,
  })
}

/**
 * 删除采购清单信息
 * @param {*} data
 */
export async function deletePurchaseById(id) {
  return request({
    url: `/purchase/${id}`,
    method: 'post',
  })
}

/**
 * 采购清单支付
 * @param {*} data
 */
export async function payPurchaseById(id) {
  return request({
    url: `/purchase/${id}/pay`,
    method: 'post',
  })
}

/**
 * 采购清单发货
 * @param {*} data
 */
export async function deliverPurchaseById(id) {
  return request({
    url: `/purchase/${id}/deliver`,
    method: 'post',
  })
}

/**
 * 采购清单新增商品
 * @param {*} data
 */
export async function savePurchaseItemByContractId(contractId, data) {
  return request({
    url: `/purchase/contract/${contractId}`,
    method: 'post',
    data: {
      purchaseItemList: data,
    },
  })
}
