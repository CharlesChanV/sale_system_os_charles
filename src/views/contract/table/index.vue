<template>
  <div class="index-container">
    <a-alert message="合同列表板块"></a-alert>
    <!-- 搜索栏 -->
    <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.contractName"
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
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.customerId"
          type="text"
          placeholder="客户ID"
          @search="onSearch"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
      </a-form-item>
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.salespersonId"
          type="text"
          placeholder="销售人员ID"
          @search="onSearch"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
      </a-form-item>
    </a-form>
    <!-- 合同列表 -->
    <a-table
      :columns="columns"
      :data-source="contractList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #customerId="{ text }">
        <a @click="showDetailModel('customer', text)">{{ text }}</a>
      </template>
      <template #salespersonId="{ text }">
        <a @click="showDetailModel('salesperson', text)">{{ text }}</a>
      </template>
      <template #status="{ text: status }">
        <span>
          <a-tag :color="statusDescription[status].color">
            {{ statusDescription[status].title }}
          </a-tag>
        </span>
      </template>
      <template #action="{ record }">
        <span>
          <a @click="editContract(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="deleteContract(record)">删除</a>
          <a-divider type="vertical" />
          <a @click="showAddPurchaseModel(record)">创建采购清单</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link" @click="toDetail(record)">管理合同</a>
        </span>
      </template>
      <template #expandedRowRender="{ record }">
        <p><smile-outlined /></p>
        <!-- <p style="margin: 0">签订日期：{{ record.signDateTime }}</p> -->
        <p style="margin: 0">开始日期：{{ record.startDate }}</p>
        <p style="margin: 0">截止日期：{{ record.endDate }}</p>
      </template>
    </a-table>
    <!-- 客户、销售人员信息查询 -->
    <a-modal
      v-model:visible="detailVisible"
      title="详情信息"
      @ok="handleDetailOk"
    >
      <div>
        <p>用户ID：{{ userDetail && userDetail.userId }}</p>
        <p>用户姓名：{{ userDetail && userDetail.name }}</p>
        <p>联系方式：{{ userDetail && userDetail.phone }}</p>
        <p>邮箱：{{ userDetail && userDetail.email }}</p>
      </div>
    </a-modal>
    <!-- 编辑合同信息 -->
    <a-modal v-model:visible="editVisible" title="编辑" @ok="handleEditOk">
      <a-form
        name="custom-validation"
        ref="ruleForm"
        :model="contractForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <!-- :rules="rules" -->
        <a-form-item has-feedback label="合同ID" name="contractId">
          <a-input
            v-model:value="contractForm.contractId"
            type="text"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="合同名称" name="contractName">
          <a-input
            v-model:value="contractForm.contractName"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="甲方" name="firstParty">
          <a-input
            v-model:value="contractForm.firstParty"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="乙方" name="secondParty">
          <a-input
            v-model:value="contractForm.secondParty"
            type="text"
            autocomplete="off"
          />
        </a-form-item>
        <a-form-item has-feedback label="客户ID" name="customerId">
          <a-input
            v-model:value="contractForm.customerId"
            type="text"
            autocomplete="off"
            disabled
          />
        </a-form-item>
        <a-form-item has-feedback label="销售人员ID" name="salespersonId">
          <a-input v-model:value="contractForm.salespersonId" disabled />
        </a-form-item>
        <a-form-item label="Resources">
          <a-radio-group
            v-model:value="contractForm.status"
            :disabled="contractForm.status == 2"
          >
            <a-radio :value="0">合同拟定</a-radio>
            <a-radio :value="1">合同履行</a-radio>
            <a-radio :value="2" disabled>合同完成</a-radio>
          </a-radio-group>
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
      v-if="addPurchaseVisible"
      v-model:visible="addPurchaseVisible"
      title="创建采购清单"
      :width="550"
      @ok="handleAddPurchaseOk"
    >
      <contract-item-table
        :contractId="currentContractId"
        v-on:submitGoodsIdCount="savePurchase"
      />
    </a-modal>
  </div>
</template>
<script>
  import { SmileOutlined } from '@ant-design/icons-vue'
  import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import {
    getContractList,
    updateContractInfo,
    deleteContract,
  } from '@/api/contract'
  import { savePurchaseItemByContractId } from '@/api/purchase'
  import { getSalespersonById } from '@/api/salesperson'
  import { getCustomerById } from '@/api/customer'
  import { message } from 'ant-design-vue'
  import ContractItemTable from './components/ContractItemTable'
  const columns = [
    {
      title: '合同ID',
      dataIndex: 'contractId',
      key: 'contractId',
    },
    {
      title: '合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
    },
    {
      title: '合同编号',
      dataIndex: 'contractNo',
      key: 'contractNo',
    },
    // {
    //   title: '甲方',
    //   dataIndex: 'firstParty',
    //   key: 'firstParty',
    // },
    // {
    //   title: '乙方',
    //   key: 'secondParty',
    //   dataIndex: 'secondParty',
    // },
    {
      title: '当前状态',
      key: 'status',
      dataIndex: 'status',
      slots: { customRender: 'status' },
    },
    {
      title: '销售员ID',
      key: 'salespersonId',
      dataIndex: 'salespersonId',
      slots: { customRender: 'salespersonId' },
    },
    {
      title: '客户ID',
      key: 'customerId',
      dataIndex: 'customerId',
      slots: { customRender: 'customerId' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]

  const statusDescription = {
    0: {
      title: '合同拟定',
      color: 'default',
    },
    1: {
      title: '合同履行',
      color: 'processing',
    },
    2: {
      title: '合同完成',
      color: 'success',
    },
  }

  export default {
    name: 'ContractTable',
    components: {
      SmileOutlined,
      // DownOutlined,
      UserOutlined,
      LockOutlined,
      ContractItemTable,
    },
    // created() {
    // },
    mounted() {
      console.log(this.$route.query)
      if (this.$route.query.customerId) {
        this.queryParam.customerId = this.$route.query.customerId
      }
      if (this.$route.query.salespersonId) {
        this.queryParam.salespersonId = this.$route.query.salespersonId
      }
      this.fetchContractList()
    },
    methods: {
      fetchContractList(page = 1, limit = 10) {
        getContractList({ page, limit, ...this.queryParam }).then(
          (response) => {
            console.log(response)
            this.contractList = response.data
            this.pagination.total = response.total
          }
        )
      },
      editContract(record) {
        this.contractForm = record
        this.editVisible = true
        console.log(record)
        message.info('editContract')
        this.fetchContractList()
      },
      deleteContract(record) {
        deleteContract(record.contractId).then((response) => {
          message.success(response.msg)
          this.fetchContractList()
        })
        // console.log(record)
        // message.info('deleteContract')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        // console.log(page, pageSize)
        this.fetchContractList(page.current, pageSize)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchContractList()
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
        // 先提交更新
        updateContractInfo(this.contractForm).then((response) => {
          message.success(response.msg)
          this.fetchContractList()
        })
        this.contractForm = {}
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      toDetail(record) {
        this.$router.push({
          path: `/ContractDetail/index/${record.contractId}`,
        })
      },
      showAddPurchaseModel(record) {
        console.log(record)
        this.currentContractId = record.contractId
        this.addPurchaseVisible = true
      },
      handleAddPurchaseOk() {
        this.addPurchaseVisible = false
      },
      savePurchase(item) {
        console.log(item)
        if (item && item.length == 0) {
          message.warning('未选择商品')
          return false
        }
        savePurchaseItemByContractId(this.currentContractId, item).then(
          (response) => {
            message.success(response.msg)
            this.addPurchaseVisible = false
            this.fetchContractList()
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
        contractList: [],
        // data,
        columns,
        statusDescription,
        queryParam: {
          contractName: '',
          firstParty: '',
          salespersonId: '',
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
        addPurchaseVisible: false,
        contractForm: {},
        currentContractId: 0,
      }
    },
  }
</script>
