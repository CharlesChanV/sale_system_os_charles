<template>
  <div class="index-container">
    <a-row :gutter="16">
      <!-- 下方为已存在的合同商品列表 -->
      <a-table :columns="contractItemColumns" :data-source="contractItemList">
        <template #name="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #count="{ text }">
          <a>{{ text }}</a>
        </template>
        <template #hasChooseCount="{ index, record }">
          <!-- <a>{{ index }}</a> -->
          <a-input-number
            id="inputNumber"
            v-model:value="goodsIdCountList[index].count"
            :min="0"
            :max="record.leaveCount"
          />
        </template>
        <template #title="">
          合同商品列表
          <a-button type="primary" @click="confirmGoodsCount">
            确认商品选择
          </a-button>
        </template>
        <!-- <template #action="{ record }">
          <span>
            <a @cliczk="deleteContractItem(record)">移除</a>
          </span>
        </template> -->
      </a-table>
    </a-row>
  </div>
</template>
<script>
  // import { message } from 'ant-design-vue'
  import { getContractItemList } from '@/api/contract'
  const contractItemColumns = [
    {
      title: 'ID',
      dataIndex: 'contractItemId',
      key: 'contractItemId',
    },
    {
      title: '商品ID',
      dataIndex: 'goodsId',
      key: 'goodsId',
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '单价',
      key: 'perPrice',
      dataIndex: 'perPrice',
      slots: { customRender: 'perPrice' },
    },
    {
      title: '总数',
      key: 'count',
      dataIndex: 'count',
      slots: { customRender: 'count' },
    },
    {
      title: '剩余(可取)数量',
      key: 'leaveCount',
      dataIndex: 'leaveCount',
      slots: { customRender: 'leaveCount' },
    },
    {
      title: '已选数量',
      key: 'hasChooseCount',
      dataIndex: 'hasChooseCount',
      slots: { customRender: 'hasChooseCount' },
    },
    // {
    //   title: '客户ID',
    //   key: 'customerId',
    //   dataIndex: 'customerId',
    //   slots: { customRender: 'customerId' },
    // },
    // {
    //   title: '操作',
    //   key: 'action',
    //   slots: { customRender: 'action' },
    // },
  ]
  export default {
    name: 'ContractItemTable',
    data() {
      return {
        contractItemColumns,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        contractItemList: [],
        goodsIdCountList: [],
        selectedGoodsRowKeys: [],
      }
    },
    props: {
      contractId: {
        type: Number,
      },
    },
    mounted() {
      this.fetchContractItemList()
    },
    methods: {
      fetchContractItemList() {
        getContractItemList(this.contractId).then((response) => {
          this.contractItemList = response.data
          this.goodsIdCountList = []
          this.contractItemList.map((item) => {
            this.goodsIdCountList.push({
              goodsId: item.goodsId,
              count: 0,
            })
          })
          // message.success('合同数据拉取成功')
        })
      },
      confirmGoodsCount() {
        let temp = []
        this.goodsIdCountList.map((item) => {
          if (item.count > 0) {
            temp.push(item)
          }
        })
        this.$emit('submitGoodsIdCount', temp)
        this.fetchContractItemList()
      },
    },
  }
</script>
