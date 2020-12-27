import request from '@/utils/request'
/**
 * 获取合同列表
 * @param {*} params
 */
export async function getContractList(params) {
  return request({
    url: '/contract',
    method: 'get',
    params,
  })
}
/**
 * 获取合同商品列表
 * @param {*} params
 */
export async function getContractItemList(contractId) {
  return request({
    url: `/contract/${contractId}/item`,
    method: 'get',
  })
}
/**
 * 获取合同信息
 * @param {*} params
 */
export async function getContractById(id) {
  return request({
    url: `/contract/${id}`,
    method: 'get',
  })
}
/**
 * 更新合同信息
 * @param {*} param0
 */
export async function updateContractInfo({
  contractId,
  contractName,
  firstParty,
  secondParty,
  status,
}) {
  return request({
    url: '/contract',
    method: 'put',
    params: {
      contractId,
      contractName,
      firstParty,
      secondParty,
      status,
    },
  })
}
/**
 * 删除合同
 * @param {*} contractId
 */
export async function deleteContract(contractId) {
  return request({
    url: `/contract/${contractId}`,
    method: 'post',
  })
}

/**
 * 新增合同
 * @param {*} contractId
 */
export async function saveContract(data) {
  return request({
    url: `/contract`,
    method: 'post',
    data,
  })
}

/**
 * 批量新增合同商品
 * @param {*} contractId
 */
export async function saveContractItem(contractId, data) {
  return request({
    url: `/contract/${contractId}/addItem`,
    method: 'post',
    data: {
      contractItemList: data,
    },
  })
}

/**
 * 批量修改合同商品
 * @param {*} contractId
 */
export async function modifyContractItem(contractId, data) {
  return request({
    url: `/contract/${contractId}/modifyItem`,
    method: 'put',
    data: {
      contractItemList: data,
    },
  })
}

/**
 * 批量修改合同商品
 * @param {*} contractId
 */
export async function deleteContractItem(contractId, data) {
  return request({
    url: `/contract/${contractId}/deleteItem`,
    method: 'post',
    data: {
      contractItemIds: data,
    },
  })
}
