<template>
  <div class="index-container">
    <!-- <a-alert message="合同添加板块"></a-alert> -->
    <a-row :gutter="16">
      <!-- 合同信息预览 -->
      <a-col xs="10" md="15" lg="20">
        <a-card title="合同详情" style="width: 470px">
          <template #extra>预览</template>
          <a-form
            layout="vertical"
            :model="contractForm"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-form-item
              label="合同名称"
              required
              has-feedback
              name="contractName"
            >
              <a-input v-model:value="contractForm.contractName" readonly />
            </a-form-item>
            <a-form-item label="甲方" required has-feedback name="firstParty">
              <a-input v-model:value="contractForm.firstParty" readonly />
            </a-form-item>
            <a-form-item label="乙方" required has-feedback name="secondParty">
              <a-input v-model:value="contractForm.secondParty" readonly />
            </a-form-item>
            <a-form-item
              label="开始时间"
              required
              has-feedback
              name="startDate"
            >
              <a-input v-model:value="contractForm.startDate" readonly />
              <!-- <a-date-picker
                v-model:value="contractForm.startDate"
                show-time
                placeholder="Pick a date"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                @change="onStartDateChange"
                readonly
              /> -->
            </a-form-item>
            <a-form-item label="截止时间" required has-feedback name="endDate">
              <a-input v-model:value="contractForm.endDate" readonly />
              <!-- <a-date-picker
                v-model:value="contractForm.endDate"
                show-time
                placeholder="Pick a date"
                style="width: 100%"
                format="YYYY-MM-DD HH:mm:ss"
                @change="onEndDateChange"
                readonly
              /> -->
            </a-form-item>
            <a-form-item
              label="销售人员"
              required
              has-feedback
              name="salespersonId"
            >
              <a-input v-model:value="contractForm.salespersonId" readonly />
            </a-form-item>
            <a-form-item label="客户ID" required has-feedback name="customerId">
              <a-input v-model:value="contractForm.customerId" readonly />
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <!-- 右边待添加的合同商品列表 -->
      <a-col xs="10" md="15" lg="20">
        <a-card title="合同商品添加" style="width: 500px">
          <a-button type="info" style="margin: 5px" @click="showAddGoodsModel">
            添加商品
          </a-button>
          <a-table :columns="chooseGoodsColumns" :data-source="chooseGoodsList">
            <template #name="{ text }">
              <a>{{ text }}</a>
            </template>
            <template #count="{ index }">
              <a-input-number
                id="inputNumber"
                v-model:value="chooseGoodsList[index].count"
                :min="1"
                :max="100000000"
              />
            </template>
            <template #action="{ record }">
              <span>
                <a @click="removeItemGoods(record)">移除</a>
              </span>
            </template>
          </a-table>
          <a-button
            type="primary"
            style="margin: 5px"
            @click="submitContractItem"
          >
            确认提交合同商品
          </a-button>
        </a-card>
      </a-col>
    </a-row>
    <!-- 下方为已存在的合同商品列表 -->
    <a-table :columns="contractItemColumns" :data-source="contractItemList">
      <template #name="{ text }">
        <a>{{ text }}</a>
      </template>
      <template #count="{ index, text }">
        <a v-if="!canModifyContractItemList">{{ text }}</a>
        <!-- id="inputNumber" -->
        <a-input-number
          v-else
          v-model:value="contractItemList[index].count"
          :min="1"
          :max="100000000"
          @change="
            changeContractItemCount(contractItemList[index].count, index)
          "
        />
      </template>
      <template #title="">
        合同商品列表
        <a-button
          v-if="!canModifyContractItemList"
          type="info"
          @click="canModifyContractItemList = true"
        >
          编辑/修改
        </a-button>
        <div v-else>
          <a-button type="primary" @click="modifyContractItem">完成</a-button>
          <a-button type="info" @click="refresh" style="margin-left: 5px">
            返回
          </a-button>
        </div>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="deleteContractItem(record)">移除</a>
        </span>
      </template>
    </a-table>
    <!-- 供选择的商品列表 -->
    <a-modal
      title="商品列表"
      v-model:visible="goodsVisible"
      width="500"
      @ok="handleGoodsOk"
    >
      <a-table
        :row-selection="{
          selectedRowKeys: selectedGoodsRowKeys,
          onChange: onGoodsSelectChange,
        }"
        :columns="goodsColumns"
        :data-source="goodsList"
        :pagination="goodsPagination"
        @change="goodsPageChange"
        bordered
      >
        <template #perPrice="{ text }">
          <span>{{ '￥' + text }}</span>
        </template>
        <template #status="{ text: status }">
          <span>
            <a-tag :color="statusDescription[status].color">
              <template #icon>
                <sync-outlined v-if="status == 1" :spin="true" />
                <!-- <check-circle-outlined v-else /> -->
                <minus-circle-outlined v-else />
              </template>
              {{ statusDescription[status].title }}
            </a-tag>
          </span>
        </template>
      </a-table>
      <a-button
        type="primary"
        style="margin: 5px"
        @click="addToChooseGoodsList"
      >
        加入商品
      </a-button>
    </a-modal>
  </div>
</template>
<script>
  import { message } from 'ant-design-vue'
  import {
    getContractById,
    getContractItemList,
    saveContractItem,
    modifyContractItem,
    deleteContractItem,
  } from '@/api/contract'
  import { getGoodsList } from '@/api/goods'
  // import { getCustomerList } from '@/api/customer'
  // import { getSalespersonList } from '@/api/salesperson'
  const chooseGoodsColumns = [
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
      title: '数量',
      key: 'count',
      dataIndex: 'count',
      slots: { customRender: 'count' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]
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
      title: '剩余数量',
      key: 'leaveCount',
      dataIndex: 'leaveCount',
      slots: { customRender: 'leaveCount' },
    },
    // {
    //   title: '客户ID',
    //   key: 'customerId',
    //   dataIndex: 'customerId',
    //   slots: { customRender: 'customerId' },
    // },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]
  const goodsColumns = [
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
      title: '商品描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '商品单价',
      dataIndex: 'perPrice',
      key: 'perPrice',
      className: 'column-money',
      slots: { customRender: 'perPrice' },
    },
    {
      title: '商品库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '商品状态',
      key: 'status',
      dataIndex: 'status',
      slots: { customRender: 'status' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]
  const statusDescription = {
    0: {
      title: '下架',
      color: 'default',
    },
    1: {
      title: '上架',
      color: 'success',
    },
  }
  export default {
    name: 'ContractDetail',
    data() {
      return {
        chooseGoodsColumns,
        contractItemColumns,
        goodsColumns,
        statusDescription,
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        contractId: 0,
        contractForm: {
          contractName: '',
          firstParty: '',
          secondParty: '',
          startDate: undefined,
          endDate: undefined,
          salespersonId: undefined,
          customerId: undefined,
        },
        contractItemList: [],
        chooseGoodsList: [],
        selectedGoodsRowKeys: [],
        goodsVisible: false,
        goodsList: [],
        goodsPagination: {
          pageSize: 10,
          current: 1,
          pageSizeOptions: ['10', '20', '30'],
          total: 100,
        },
        goodsQueryParam: {
          name: '',
          status: undefined,
        },
        canModifyContractItemList: false,
        // salespersonData: [],
        // customerData: [],
      }
    },
    created() {
      this.contractId = this.$route.params.contractId
      this.fetchContractInfo()
      this.fetchContractItemList()
    },
    methods: {
      fetchContractInfo() {
        getContractById(this.contractId).then((response) => {
          this.contractForm = response.data
          message.success('合同信息获取成功')
        })
      },
      fetchContractItemList() {
        getContractItemList(this.contractId).then((response) => {
          this.contractItemList = response.data
          message.success('合同数据拉取成功')
        })
      },
      submitContractItem() {
        if (this.chooseGoodsList.length < 1) {
          message.warning('无待添加合同商品')
          return false
        }
        saveContractItem(this.contractId, this.chooseGoodsList).then(
          (response) => {
            message.success(response.msg)
            this.chooseGoodsList = []
            this.fetchContractItemList()
          }
        )
      },
      modifyContractItem() {
        modifyContractItem(this.contractId, this.contractItemList).then(
          (response) => {
            message.success(response.msg)
            this.fetchContractItemList()
            this.canModifyContractItemList = false
          }
        )
      },
      onStartDateChange(value, dateString) {
        this.contractForm.startDate = dateString
      },
      onEndDateChange(value, dateString) {
        this.contractForm.endDate = dateString
      },
      cancel() {
        this.$router.push('/contract/table')
      },
      removeItemGoods(record) {
        console.log(record)
        this.chooseGoodsList.every((item, index) => {
          console.log(index)
          if (item.goodsId == record.goodsId) {
            this.chooseGoodsList.splice(index, 1)
            return false
          }
          return true
        })
      },
      deleteContractItem(record) {
        deleteContractItem(this.contractId, [record.contractItemId]).then(
          (response) => {
            message.success(response.msg)
            this.fetchContractItemList()
          }
        )
      },
      handleGoodsOk() {
        this.goodsVisible = false
      },
      showAddGoodsModel() {
        this.goodsVisible = true
        this.fetchGoodsList()
      },
      goodsPageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchGoodsList(page.current)
        this.goodsPagination.current = page.current
        this.goodsPagination.pageSize = page.pageSize
      },
      // 请求商品列表
      fetchGoodsList(page = 1, limit = 10) {
        getGoodsList({ page, limit, ...this.goodsQueryParam }).then(
          (response) => {
            console.log(response)
            this.goodsList = response.data
            this.goodsPagination.pageSize = response.size
            this.goodsPagination.total = response.total
          }
        )
      },
      onGoodsSelectChange(selectedRowKeys) {
        console.log(selectedRowKeys)
        this.selectedGoodsRowKeys = selectedRowKeys
      },
      addToChooseGoodsList() {
        this.selectedGoodsRowKeys.map((item) => {
          this.chooseGoodsList.push({
            goodsId: this.goodsList[item].goodsId,
            name: this.goodsList[item].name,
            count: 1,
          })
        })
        this.selectedGoodsRowKeys = []
        let temp = []
        this.chooseGoodsList = this.chooseGoodsList.filter((item) => {
          if (temp.includes(item.goodsId)) {
            return false
          }
          temp.push(item.goodsId)
          return true
        })
        message.success('添加成功')
      },
      changeContractItemCount(value, index) {
        this.contractItemList[index].leaveCount = value
      },
      refresh() {
        location.reload()
      },
    },
  }
</script>
