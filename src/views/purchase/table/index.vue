<template>
  <div class="index-container">
    <a-alert message="采购清单列表板块"></a-alert>
    <!-- <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.purchaseName"
          placeholder="合同名称"
          @search="onSearch"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.firstParty"
          type="text"
          placeholder="合同甲方"
          @search="onSearch"
        >
          <template #prefix>
            <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
      </a-form-item>
    </a-form> -->
    <a-table
      :columns="columns"
      :data-source="purchaseList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #customerId="{ text }">
        <a @click="showDetailModel('customer', text)">{{ text }}</a>
      </template>
      <!-- <template #salespersonId="{ text }">
        <a @click="showDetailModel('salesperson', text)">{{ text }}</a>
      </template> -->
      <template #payStatus="{ text: payStatus }">
        <span>
          <a-tag :color="payStatusDescription[payStatus].color">
            {{ payStatusDescription[payStatus].title }}
          </a-tag>
        </span>
      </template>
      <template #deliverStatus="{ text: deliverStatus }">
        <span>
          <a-tag :color="deliverStatusDescription[deliverStatus].color">
            <template #icon>
              <sync-outlined v-if="deliverStatus == 0" :spin="true" />
              <check-circle-outlined v-else />
            </template>
            {{ deliverStatusDescription[deliverStatus].title }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="editpurchase(record)">预览</a>
          <a-divider type="vertical" />
          <a v-if="record.payStatus == 0" @click="payPurchase(record)">支付</a>
          <span v-else style="color: grey">已支付</span>
          <a-divider type="vertical" />
          <a v-if="record.deliverStatus == 0" @click="deliverPurchase(record)">
            发货
          </a>
          <a v-else @click="checkLogistics(record.logisticsId)">查看物流</a>
          <a-divider type="vertical" />
          <a @click="deletePurchase(record)">删除</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
        </span>
      </template>
      <template #expandedRowRender="{ record }">
        <p><smile-outlined /></p>
        <!-- <p style="margin: 0">签订日期：{{ record.signDateTime }}</p> -->
        <p style="margin-bottom: 20px">创建时间：{{ record.createTime }}</p>
        <a-table
          :columns="purchaseItemColumns"
          :data-source="record.purchaseItemList"
          :pagination="false"
        >
          <template #deliverStatus="{}">
            {{
              record.deliverStatus == 0
                ? '未发货'
                : '已发货 | 物流ID: ' + record.logisticsId
            }}
          </template>
        </a-table>
        <a-divider type="vertical" />
      </template>
    </a-table>
    <!-- 查看人员详细信息 -->
    <a-modal
      v-model:visible="detailVisible"
      title="详情信息"
      @ok="handleDetailOk"
    >
      <div>
        <p>ID：{{ userDetail && userDetail.userId }}</p>
        <p>姓名：{{ userDetail && userDetail.name }}</p>
        <p>联系方式：{{ userDetail && userDetail.phone }}</p>
        <p>邮箱：{{ userDetail && userDetail.email }}</p>
      </div>
    </a-modal>
    <!-- 清单信息预览 -->
    <a-modal v-model:visible="editVisible" title="预览" @ok="handleEditOk">
      <a-form
        name="custom-validation"
        ref="ruleForm"
        :model="purchaseForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="清单ID">
          <a-input
            v-model:value="purchaseForm.purchaseId"
            type="text"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="清单编号">
          <a-input
            v-model:value="purchaseForm.purchaseNo"
            type="text"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="创建时间">
          <a-input
            v-model:value="purchaseForm.createTime"
            type="text"
            readonly
          />
        </a-form-item>
        <a-form-item has-feedback label="客户ID" name="customerId">
          <a-input
            v-model:value="purchaseForm.customerId"
            type="text"
            autocomplete="off"
            readonly
          />
        </a-form-item>
        <a-form-item has-feedback label="合同ID">
          <a-input v-model:value="purchaseForm.contractId" readonly />
        </a-form-item>
        <a-form-item has-feedback label="用户ID">
          <a-input v-model:value="purchaseForm.userId" readonly />
        </a-form-item>
        <a-form-item label="支付状态">
          <a-tag :color="payStatusDescription[purchaseForm.payStatus].color">
            {{ payStatusDescription[purchaseForm.payStatus].title }}
          </a-tag>
        </a-form-item>
        <a-form-item label="发货状态">
          <a-tag
            :color="deliverStatusDescription[purchaseForm.deliverStatus].color"
          >
            <template #icon>
              <sync-outlined
                v-if="purchaseForm.deliverStatus == 0"
                :spin="true"
              />
              <check-circle-outlined v-else />
            </template>
            {{ deliverStatusDescription[purchaseForm.deliverStatus].title }}
          </a-tag>
        </a-form-item>
        <a-form-item has-feedback label="物流ID">
          <a-input v-model:value="purchaseForm.logisticsId" readonly />
        </a-form-item>
        <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }"> -->
        <!-- <a-button type="primary" html-type="submit">确认修改</a-button> -->
        <!-- <a-button style="margin-left: 10px" @click="resetForm">
            Reset
          </a-button> -->
        <!-- </a-form-item> -->
      </a-form>
    </a-modal>
    <a-modal
      v-model:visible="logisticsVisible"
      title="查看物流"
      @ok="logisticsVisible = false"
    >
      <!-- <pre>{{ currentLogistics }}</pre> -->
      <!-- <div>创建时间:{{ currentLogistics.createTime }}</div> -->
      <a-descriptions title="物流信息" layout="vertical">
        <a-descriptions-item label="物流公司">
          {{ currentLogistics.companyName }}
        </a-descriptions-item>
        <a-descriptions-item label="物流费用">
          {{ currentLogistics.fee }}
        </a-descriptions-item>
        <a-descriptions-item label="物流编号">
          {{ currentLogistics.logisticsNo }}
        </a-descriptions-item>
        <a-descriptions-item label="发货人">
          {{ currentLogistics.senderName }}
        </a-descriptions-item>
        <a-descriptions-item label="发货联系方式">
          {{ currentLogistics.senderPhone }}
        </a-descriptions-item>
        <a-descriptions-item label="发货地址">
          {{ currentLogistics.senderAddress }}
        </a-descriptions-item>
        <a-descriptions-item label="收货人">
          {{ currentLogistics.addresseeName }}
        </a-descriptions-item>
        <a-descriptions-item label="收货联系方式">
          {{ currentLogistics.addresseePhone }}
        </a-descriptions-item>
        <a-descriptions-item label="收货地址">
          {{ currentLogistics.addresseeAddress }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
  import {
    SmileOutlined,
    DownOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
  } from '@ant-design/icons-vue'
  import { createVNode } from 'vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import {
    getPurchaseList,
    // updatePurchase,
    deletePurchaseById,
    payPurchaseById,
    deliverPurchaseById,
  } from '@/api/purchase'
  import { getSalespersonById } from '@/api/salesperson'
  import { getCustomerById } from '@/api/customer'
  import { getLogisticsById } from '@/api/logistics'
  import { message, Modal } from 'ant-design-vue'
  const columns = [
    {
      title: '清单ID',
      dataIndex: 'purchaseId',
      key: 'purchaseId',
    },
    {
      title: '清单编号',
      dataIndex: 'purchaseNo',
      key: 'purchaseNo',
    },
    {
      title: '支付状态',
      key: 'payStatus',
      dataIndex: 'payStatus',
      slots: { customRender: 'payStatus' },
    },
    {
      title: '发货状态',
      key: 'deliverStatus',
      dataIndex: 'deliverStatus',
      slots: { customRender: 'deliverStatus' },
    },
    // {
    //   title: '销售员ID',
    //   key: 'salespersonId',
    //   dataIndex: 'salespersonId',
    //   slots: { customRender: 'salespersonId' },
    // },
    {
      title: '客户ID',
      key: 'customerId',
      dataIndex: 'customerId',
      slots: { customRender: 'customerId' },
    },
    {
      title: '合同ID',
      key: 'contractId',
      dataIndex: 'contractId',
      slots: { customRender: 'contractId' },
    },
    {
      title: 'userID',
      key: 'userId',
      dataIndex: 'userId',
      slots: { customRender: 'userId' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]

  const purchaseItemColumns = [
    {
      title: '清单商品ID',
      dataIndex: 'purchaseItemId',
      key: 'purchaseItemId',
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
      dataIndex: 'perPrice',
      key: 'perPrice',
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '发货状态',
      dataIndex: 'deliverStatus',
      key: 'deliverStatus',
      slots: { customRender: 'deliverStatus' },
    },
  ]

  const payStatusDescription = {
    0: {
      title: '未支付',
      color: 'default',
    },
    1: {
      title: '已支付',
      color: 'success',
    },
  }
  const deliverStatusDescription = {
    0: {
      title: '未发货',
      color: 'processing',
    },
    1: {
      title: '已发货',
      color: 'success',
    },
  }

  export default {
    name: 'PurchaseTable',
    components: {
      SmileOutlined,
      DownOutlined,
      SyncOutlined,
      CheckCircleOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchPurchaseList()
    },
    methods: {
      fetchPurchaseList(page = 1, limit = 10) {
        getPurchaseList({ page, limit, ...this.queryParam }).then(
          (response) => {
            console.log(response)
            this.purchaseList = response.data
            this.pagination.total = response.total
          }
        )
      },
      editpurchase(record) {
        this.purchaseForm = record
        this.editVisible = true
        console.log(record)
        message.info('editpurchase')
        // this.fetchPurchaseList()
      },
      deletePurchase(record) {
        deletePurchaseById(record.purchaseId).then((response) => {
          message.success(response.msg)
          this.fetchPurchaseList()
        })
        console.log(record)
        // message.info('deletePurchase')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchPurchaseList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchPurchaseList()
      },
      showDetailModel(type, id) {
        switch (type) {
          case 'customer':
            getCustomerById(id)
              .then((response) => {
                this.userDetail = response.data
                this.detailVisible = true
                if (!this.userDetail) {
                  message.warning('暂无数据')
                }
              })
              .catch((err) => {
                console.log(err)
                message.error('网络异常')
              })
            break
          case 'salesperson':
            getSalespersonById(id)
              .then((response) => {
                this.userDetail = response.data
                this.detailVisible = true
                if (!this.userDetail) {
                  message.warning('暂无数据')
                }
              })
              .catch((err) => {
                console.log(err)
                message.error('网络异常')
              })
            break
        }
        console.log(id)
      },
      handleDetailOk() {
        this.detailVisible = false
        this.userDetail = {}
      },
      handleEditOk() {
        this.editVisible = false
        // this.purchaseForm = {}
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      payPurchase(record) {
        let price = 0
        if (record.purchaseItemList && record.purchaseItemList.length > 0) {
          record.purchaseItemList.map((item) => {
            price += item.perPrice * item.count
          })
        }
        const that = this
        Modal.confirm({
          title: '确认支付采购清单?',
          icon: createVNode(ExclamationCircleOutlined),
          content: `总价：${price}元`,
          onOk() {
            // return new Promise((resolve, reject) => {
            //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            // }).catch(() => console.log('Oops errors!'))
            payPurchaseById(record.purchaseId).then((response) => {
              message.success(response.msg)
              that.fetchPurchaseList()
            })
          },
          onCancel() {},
        })
      },
      deliverPurchase(record) {
        const that = this
        Modal.confirm({
          title: '确认发货?',
          icon: createVNode(ExclamationCircleOutlined),
          content: '发货后会自动生成相应的物流信息',
          onOk() {
            // return new Promise((resolve, reject) => {
            //   setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            // }).catch(() => console.log('Oops errors!'))
            deliverPurchaseById(record.purchaseId).then((response) => {
              message.success(response.msg)
              that.fetchPurchaseList()
            })
          },
          onCancel() {},
        })
      },
      checkLogistics(logisticsId) {
        // message.success('检查物流' + logisticsId)
        getLogisticsById(logisticsId).then((response) => {
          message.success(response.msg)
          this.currentLogistics = response.data
          this.logisticsVisible = true
        })
      },
    },
    data() {
      return {
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
        purchaseList: [],
        // data,
        columns,
        purchaseItemColumns,
        payStatusDescription,
        queryParam: {
          // purchaseName: '',
          // firstParty: '',
          // salespersonId: '',
          customerId: '',
        },
        pagination: {
          pageSize: 10,
          current: 1,
          pageSizeOptions: ['10', '20', '30'],
          total: 100,
        },
        userDetail: {},
        detailVisible: false,
        editVisible: false,
        purchaseForm: {},
        deliverStatusDescription,
        currentLogistics: {},
        logisticsVisible: false,
      }
    },
  }
</script>
