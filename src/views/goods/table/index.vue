<template>
  <div class="index-container">
    <a-alert message="商品列表板块"></a-alert>
    <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.name"
          placeholder="商品名称"
          @search="onSearch"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
        <!-- <a-input-search
          v-model:value="queryParam.status"
          placeholder="商品在架状态"
          @search="onSearch"
        >
        </a-input-search> -->
      </a-form-item>
      <a-form-item>
        <a-select
          v-model:value="queryParam.status"
          style="width: 120px"
          ref="select"
          allowClear="true"
          placeholder="在架状态"
          @change="onSearch"
        >
          <a-select-option :value="0">下架</a-select-option>
          <a-select-option :value="1">在架</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="goodsList"
      :pagination="pagination"
      @change="pageChange"
      bordered
    >
      <template #perPrice="{ text }">
        <span>{{ '￥' + text }}</span>
      </template>
      <!-- <template #salespersonId="{ text }">
        <a @click="showDetailModel('salesperson', text)">{{ text }}</a>
      </template> -->
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
      <template #action="{ record }">
        <span>
          <a @click="editGoods(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteGoods(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="changeGoodsStatus(record)">
            {{ record.status == 0 ? '上架' : '下架' }}
          </a>
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
        <p style="margin: 0">创建时间：{{ record.createTime }}</p>
        <!-- <p style="margin: 0">更新时间：{{ record.updateTime }}</p> -->
      </template>
    </a-table>
    <a-modal v-model:visible="editVisible" title="编辑" @ok="handleEditOk">
      <a-form
        name="custom-validation"
        ref="ruleForm"
        :model="goodsForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="商品ID">
          <a-input v-model:value="goodsForm.goodsId" type="text" disabled />
        </a-form-item>
        <a-form-item has-feedback label="商品名称">
          <a-input v-model:value="goodsForm.name" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="商品描述">
          <a-input v-model:value="goodsForm.description" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="商品单价">
          <a-input-number
            v-model:value="goodsForm.perPrice"
            :formatter="
              (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            "
            :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
          />
        </a-form-item>
        <a-form-item has-feedback label="商品库存">
          <a-input-number
            id="inputNumber"
            v-model:value="goodsForm.stock"
            :min="0"
            :max="100000000"
          />
        </a-form-item>

        <a-form-item has-feedback label="创建时间">
          <a-input v-model:value="goodsForm.createTime" type="text" readonly />
        </a-form-item>
        <a-form-item label="商品状态">
          <a-tag :color="statusDescription[goodsForm.status].color">
            <template #icon>
              <sync-outlined v-if="goodsForm.status == 1" :spin="true" />
              <!-- <check-circle-outlined v-else /> -->
              <minus-circle-outlined v-else />
            </template>
            {{ statusDescription[goodsForm.status].title }}
          </a-tag>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import {
    SmileOutlined,
    DownOutlined,
    SyncOutlined,
    // CheckCircleOutlined,
    MinusCircleOutlined,
  } from '@ant-design/icons-vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { getGoodsList, updateGoods, deleteGoodsById } from '@/api/goods'
  // import { getSalespersonById } from '@/api/salesperson'
  // import { getCustomerById } from '@/api/customer'
  import { message } from 'ant-design-vue'
  const columns = [
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
    name: 'GoodsTable',
    components: {
      SmileOutlined,
      DownOutlined,
      SyncOutlined,
      // CheckCircleOutlined,
      MinusCircleOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchGoodsList()
    },
    methods: {
      // 请求商品列表
      fetchGoodsList(page = 1, limit = 10) {
        getGoodsList({ page, limit, ...this.queryParam }).then((response) => {
          console.log(response)
          this.goodsList = response.data
          this.pagination.total = response.total
          this.pagination.pageSize = response.size
        })
      },
      // 打开商品编辑框
      editGoods(record) {
        this.goodsForm = record
        this.editVisible = true
        console.log(record)
        message.info('editGoods')
        // this.fetchGoodsList()
      },
      // 删除商品信息
      deleteGoods(record) {
        deleteGoodsById(record.goodsId).then((response) => {
          message.success(response.msg)
          this.fetchGoodsList()
        })
        console.log(record)
        // message.info('deleteGoods')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchGoodsList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      // 搜索激活框
      onSearch() {
        this.fetchGoodsList()
      },
      handleDetailOk() {
        this.detailVisible = false
        this.userDetail = {}
      },
      // model更新商品信息
      handleEditOk() {
        this.editVisible = false
        updateGoods(this.goodsForm).then((response) => {
          message.success(response.msg)
          this.fetchGoodsList()
        })
        // this.goodsForm = {}
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      // 改变商品在架状态
      changeGoodsStatus(record) {
        updateGoods({
          goodsId: record.goodsId,
          status: record.status == 0 ? 1 : 0,
        }).then((response) => {
          message.success(response.msg)
          this.fetchGoodsList()
        })
      },
    },
    data() {
      return {
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
        goodsList: [],
        // data,
        columns,
        queryParam: {
          name: '',
          status: undefined,
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
        goodsForm: {},
        statusDescription,
      }
    },
  }
</script>
<style>
  th.column-money,
  td.column-money {
    text-align: right !important;
  }
</style>
