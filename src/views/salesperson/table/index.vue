<template>
  <div class="index-container">
    <a-alert message="销售人员列表板块"></a-alert>
    <!-- <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.SalespersonName"
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
      :data-source="salespersonList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #action="{ record }">
        <span>
          <a @click="editSalesperson(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteSalesperson(record)">删除</a>
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
        :model="salespersonForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="销售人员ID">
          <a-input
            v-model:value="salespersonForm.salespersonId"
            type="text"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="姓名">
          <a-input v-model:value="salespersonForm.name" type="text" />
        </a-form-item>
        <a-form-item has-feedback label="联系方式">
          <a-input v-model:value="salespersonForm.phone" />
        </a-form-item>
        <a-form-item has-feedback label="邮箱">
          <a-input v-model:value="salespersonForm.email" />
        </a-form-item>
        <a-form-item has-feedback label="用户ID">
          <a-input v-model:value="salespersonForm.userId" readonly />
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
    getSalespersonList,
    updateSalesperson,
    deleteSalespersonById,
  } from '@/api/salesperson'
  import { message } from 'ant-design-vue'
  const columns = [
    {
      title: '销售人员ID',
      dataIndex: 'salespersonId',
      key: 'salespersonId',
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
    name: 'SalespersonTable',
    components: {
      SmileOutlined,
      DownOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchSalespersonList()
    },
    methods: {
      fetchSalespersonList(page = 1, limit = 10) {
        getSalespersonList({ page, limit, ...this.queryParam }).then(
          (response) => {
            console.log(response)
            this.salespersonList = response.data
            this.pagination.total = response.total
          }
        )
      },
      editSalesperson(record) {
        this.salespersonForm = record
        this.editVisible = true
        console.log(record)
        message.info('editSalesperson')
        // this.fetchSalespersonList()
      },
      deleteSalesperson(record) {
        deleteSalespersonById(record.salespersonId).then((response) => {
          message.success(response.msg)
          this.fetchSalespersonList()
        })
        console.log(record)
        // message.info('deleteSalesperson')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchSalespersonList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchSalespersonList()
      },
      handleDetailOk() {
        this.detailVisible = false
        this.userDetail = {}
      },
      handleEditOk() {
        this.editVisible = false
        updateSalesperson(this.salespersonForm).then((response) => {
          message.success(response.msg)
          this.fetchSalespersonList()
        })
        // this.salespersonForm = {}
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
        salespersonList: [],
        // data,
        columns,
        queryParam: {
          // SalespersonName: '',
          // firstParty: '',
          // salespersonId: '',
          name: '',
          phone: '',
          salespersonId: '',
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
        salespersonForm: {},
      }
    },
  }
</script>
