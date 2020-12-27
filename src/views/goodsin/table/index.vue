<template>
  <div class="index-container">
    <a-alert message="入货单列表板块"></a-alert>
    <!-- <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.goodsInName"
          placeholder="进货单名称"
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
          placeholder="进货单甲方"
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
      :data-source="goodsInList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #status="{ text: status }">
        <span>
          <a-tag :color="statusDescription[status].color">
            {{ statusDescription[status].title }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="editGoodsIn(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 0" @click="confirmStatus(record)">
            确认进货
          </a>
          <span style="color: grey" v-else>已确认进货</span>
          <a-divider type="vertical" />
          <a @click="deleteGoodsIn(record)">删除</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
        </span>
      </template>
    </a-table>
    <a-modal v-model:visible="editVisible" title="编辑" @ok="handleEditOk">
      <a-form
        name="custom-validation"
        ref="ruleForm"
        :model="goodsInForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="入货单ID">
          <a-input v-model:value="goodsInForm.goodsId" type="text" disabled />
        </a-form-item>
        <a-form-item has-feedback label="商品ID">
          <a-input v-model:value="goodsInForm.goodsId" type="text" readonly />
        </a-form-item>
        <a-form-item has-feedback label="商品数量">
          <a-input-number
            id="inputNumber"
            v-model:value="goodsInForm.count"
            :min="0"
            :max="100000000"
            :disabled="goodsInForm.status == 1"
          />
        </a-form-item>
        <a-form-item has-feedback label="备注">
          <a-input v-model:value="goodsInForm.remark" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="进货状态">
          <a-tag v-if="goodsInForm.status == 0" color="processing">
            <template #icon>
              <sync-outlined :spin="true" />
            </template>
            正在进货
          </a-tag>
          <a-tag v-else color="success">
            <template #icon>
              <sync-outlined :spin="false" />
            </template>
            已进货
          </a-tag>
          <!-- <a-button v-else type="primary" @click="withdrawStatus(0)">
            撤回进货状态
          </a-button> -->
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { DownOutlined } from '@ant-design/icons-vue'
  // import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import {
    getGoodsInList,
    updateGoodsIn,
    deleteGoodsInById,
  } from '@/api/goodsin'
  // import { getSalespersonById } from '@/api/salesperson'
  // import { getCustomerById } from '@/api/customer'
  import { message } from 'ant-design-vue'
  const columns = [
    {
      title: '进货单ID',
      dataIndex: 'goodsInId',
      key: 'goodsInId',
    },
    {
      title: '当前状态',
      key: 'status',
      dataIndex: 'status',
      slots: { customRender: 'status' },
    },
    {
      title: '商品ID',
      key: 'goodsId',
      dataIndex: 'goodsId',
      slots: { customRender: 'goodsId' },
    },
    {
      title: '商品名称',
      key: 'name',
      dataIndex: 'name',
      slots: { customRender: 'name' },
    },
    {
      title: '商品数量',
      key: 'count',
      dataIndex: 'count',
      slots: { customRender: 'count' },
    },
    // {
    //   title: '物流ID',
    //   key: 'logisticsId',
    //   dataIndex: 'logisticsId',
    //   slots: { customRender: 'logisticsId' },
    // },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      slots: { customRender: 'remark' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]

  const statusDescription = {
    0: {
      title: '未进货',
      color: 'default',
    },
    1: {
      title: '已进货',
      color: 'processing',
    },
  }

  export default {
    name: 'GoodsInTable',
    components: {
      // SmileOutlined,
      DownOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchGoodsInList()
    },
    methods: {
      fetchGoodsInList(page = 1, limit = 10) {
        getGoodsInList({ page, limit, ...this.queryParam }).then((response) => {
          console.log(response)
          this.goodsInList = response.data
          this.pagination.total = response.total
        })
      },
      editGoodsIn(record) {
        this.goodsInForm = record
        this.editVisible = true
        console.log(record)
        message.info('editGoodsIn')
        this.fetchGoodsInList()
      },
      deleteGoodsIn(record) {
        deleteGoodsInById(record.goodsInId).then((response) => {
          message.success(response.msg)
          this.fetchGoodsInList()
        })
        console.log(record)
        // message.info('deleteGoodsIn')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchGoodsInList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchGoodsInList()
      },
      withdrawStatus(status) {
        this.goodsInForm.status = status
        this.handleEditOk()
      },
      handleEditOk() {
        this.editVisible = false
        // 先提交更新
        updateGoodsIn(this.goodsInForm).then((response) => {
          message.success(response.msg)
          this.fetchGoodsInList()
        })
        this.goodsInForm = {}
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      confirmStatus(record) {
        updateGoodsIn({ goodsInId: record.goodsInId, status: 1 }).then(
          (response) => {
            message.success(response.msg)
            this.fetchGoodsInList()
          }
        )
      },
    },
    data() {
      return {
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
        goodsInList: [],
        // data,
        columns,
        statusDescription,
        queryParam: {
          goodsId: '',
        },
        pagination: {
          pageSize: 10,
          current: 1,
          pageSizeOptions: ['10', '20', '30'],
          total: 100,
        },
        goodsInForm: {},
        editVisible: false,
      }
    },
  }
</script>
