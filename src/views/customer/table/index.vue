<template>
  <div class="index-container">
    <a-alert message="客户列表板块"></a-alert>
    <!-- <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.customerName"
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
      :data-source="customerList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #action="{ record }">
        <span>
          <a @click="editCustomer(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteCustomer(record)">删除</a>
          <a-divider type="vertical" />
          <router-link
            class="ant-dropdown-link"
            :to="{
              path: '/contract/table',
              query: { customerId: record.customerId },
            }"
          >
            查看合同
            <down-outlined />
          </router-link>
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
        :model="customerForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="客户ID">
          <a-input
            v-model:value="customerForm.customerId"
            type="text"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="姓名">
          <a-input v-model:value="customerForm.name" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="联系方式">
          <a-input v-model:value="customerForm.phone" />
        </a-form-item>
        <a-form-item has-feedback label="邮箱">
          <a-input v-model:value="customerForm.email" />
        </a-form-item>
        <a-form-item has-feedback label="地址">
          <a-input v-model:value="customerForm.address" />
        </a-form-item>
        <a-form-item has-feedback label="用户ID">
          <a-input v-model:value="customerForm.userId" readonly />
        </a-form-item>
        <!-- <a-form-item :wrapper-col="{ span: 14, offset: 4 }"> -->
        <!-- <a-button type="primary" html-type="submit">确认修改</a-button> -->
        <!-- <a-button style="margin-left: 10px" @click="resetForm">
            Reset
          </a-button> -->
        <!-- </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import {
    getCustomerList,
    updateCustomer,
    deleteCustomerById,
  } from '@/api/customer'
  import { getSalespersonById } from '@/api/salesperson'
  import { getCustomerById } from '@/api/customer'
  import { message } from 'ant-design-vue'
  const columns = [
    {
      title: '客户ID',
      dataIndex: 'customerId',
      key: 'customerId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系方式',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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

  export default {
    name: 'CustomerTable',
    components: {
      SmileOutlined,
      DownOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchCustomerList()
    },
    methods: {
      fetchCustomerList(page = 1, limit = 10) {
        getCustomerList({ page, limit, ...this.queryParam }).then(
          (response) => {
            console.log(response)
            this.customerList = response.data
            this.pagination.total = response.total
          }
        )
      },
      editCustomer(record) {
        this.customerForm = record
        this.editVisible = true
        console.log(record)
        message.info('editcustomer')
        // this.fetchCustomerList()
      },
      deleteCustomer(record) {
        deleteCustomerById(record.customerId).then((response) => {
          message.success(response.msg)
          this.fetchCustomerList()
        })
        console.log(record)
        // message.info('deletecustomer')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchCustomerList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchCustomerList()
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
        updateCustomer(this.customerForm).then((response) => {
          message.success(response.msg)
          this.fetchCustomerList()
        })
        // this.customerForm = {}
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
    },
    data() {
      return {
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
        customerList: [],
        // data,
        columns,
        queryParam: {
          // customerName: '',
          // firstParty: '',
          // salespersonId: '',
          name: '',
          phone: '',
          customerId: '',
          userId: '',
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
        customerForm: {},
      }
    },
  }
</script>
