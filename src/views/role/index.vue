<template>
  <div class="index-container">
    <a-alert message="用户角色控制列表板块"></a-alert>
    <a-form layout="inline">
      <a-form-item>
        <a-input-search
          v-model:value="queryParam.username"
          placeholder="用户名"
          @search="onSearch"
        >
          <template #prefix>
            <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
          </template>
        </a-input-search>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="userList"
      :pagination="pagination"
      @change="pageChange"
    >
      <template #roleList="{ text }">
        <ul>
          <li v-for="item in text" :key="item.id">{{ item.description }}</li>
        </ul>
        <!-- <pre>{{ text }}</pre> -->
      </template>
      <!-- <template #status="{ text: status }">
        <span>
          <a-tag :color="statusDescription[status].color">
            {{ statusDescription[status].title }}
          </a-tag>
        </span>
      </template> -->
      <template #action="{ record }">
        <span>
          <a @click="showSetRole(record)">编辑角色</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            更多操作
            <down-outlined />
          </a>
        </span>
      </template>
    </a-table>
    <a-modal
      v-model:visible="editVisible"
      title="编辑"
      :width="600"
      @ok="handleEditOk"
    >
      <a-form
        name="custom-validation"
        ref="ruleForm"
        layout="vertical"
        :model="userForm"
        v-bind="layout"
        @finish="handleFinish"
        @finishFailed="handleFinishFailed"
      >
        <a-form-item has-feedback label="用户ID">
          <a-input v-model:value="userForm.userId" type="text" disabled />
        </a-form-item>
        <a-form-item has-feedback label="用户名">
          <a-input v-model:value="userForm.username" type="text" readonly />
        </a-form-item>
        <a-form-item has-feedback label="用户角色">
          <!-- <ul v-if="userForm.roleList.length > 0">
            <li v-for="item in userForm.roleList" :key="item.id">
              {{ item.description }}
            </li>
          </ul>
          <span v-else>无</span> -->
          <!-- <a-checkbox-group v-model:value="roleList" :options="plainOptions" @change="onChange" /> -->
          <a-table :columns="roleInfocolumns" :data-source="userForm.roleList">
            <template #action="{ record }">
              <span>
                <a @click="deleteRole(userForm.userId, record.id)">删除角色</a>
                <a-divider type="vertical" />
              </span>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item has-feedback label="添加角色">
          <a-select
            show-search
            v-model:value="userForm.roleId"
            placeholder="选择角色"
            style="width: 200px"
            :default-active-first-option="false"
            :show-arrow="false"
            :filter-option="false"
            :not-found-content="null"
          >
            <a-select-option v-for="d in remoteRoleList" :key="d.id">
              {{ d.description }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button @click="confirmSetRole">确认添加</a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
  import { DownOutlined } from '@ant-design/icons-vue'
  // import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { getUserList } from '@/api/user'
  import { setUserRole, deleteUserRole, getRoleList } from '@/api/admin'
  import { message } from 'ant-design-vue'
  const columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '用户名',
      key: 'username',
      dataIndex: 'username',
      slots: { customRender: 'username' },
    },
    {
      title: '用户角色',
      key: 'roleList',
      dataIndex: 'roleList',
      slots: { customRender: 'roleList' },
    },
    {
      title: '操作',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]
  const roleInfocolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Action',
      key: 'action',
      slots: { customRender: 'action' },
    },
  ]

  // const statusDescription = {
  //   0: {
  //     title: '未进货',
  //     color: 'default',
  //   },
  //   1: {
  //     title: '已进货',
  //     color: 'processing',
  //   },
  // }

  export default {
    name: 'RoleTable',
    components: {
      // SmileOutlined,
      DownOutlined,
      // UserOutlined,
      // LockOutlined,
    },
    created() {
      this.fetchUserList()
      this.fetchRoleList()
    },
    methods: {
      fetchUserList(page = 1, limit = 10) {
        getUserList({ page, limit, ...this.queryParam }).then((response) => {
          console.log(response)
          this.userList = response.data
          this.pagination.total = response.total
          console.log(this.userList)
        })
      },
      showSetRole(record) {
        // this.userForm = record
        Object.assign(this.userForm, record)
        this.editVisible = true
        console.log(record)
        message.info('setRole')
        this.fetchUserList()
      },
      deleteuser(record) {
        // deleteUserById(record.userId).then((response) => {
        //   message.success(response.msg)
        //   this.fetchUserList()
        // })
        console.log(record)
        // message.info('deleteuser')
      },
      onShowSizeChange(current, pageSize) {
        console.log(current, pageSize)
      },
      pageChange(page, pageSize) {
        console.log(page, pageSize)
        this.fetchUserList(page.current)
        this.pagination.current = page.current
        this.pagination.pageSize = page.pageSize
      },
      onSearch() {
        this.fetchUserList()
      },
      withdrawStatus(status) {
        this.userForm.status = status
        this.handleEditOk()
      },
      handleEditOk() {
        this.editVisible = false
        // 先提交更新
        // setUserRole({
        //   userId: this.userForm.userId,
        //   roleId: this.userForm.roleId,
        // }).then((response) => {
        //   message.success(response.msg)
        //   this.fetchUserList()
        // })
        this.userForm = {
          roleId: undefined,
        }
      },
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      confirmSetRole() {
        setUserRole({
          userId: this.userForm.userId,
          roleId: this.userForm.roleId,
        }).then((response) => {
          message.success(response.msg)
          this.fetchUserList()
          this.handleEditOk()
        })
      },
      deleteRole(userId, roleId) {
        deleteUserRole({ userId: userId, roleId: roleId }).then((response) => {
          message.success(response.msg)
          this.fetchUserList()
          this.userForm.roleList.every((item, index) => {
            if (item.id == roleId) {
              this.userForm.roleList.splice(index, 1)
              return false
            }
            return true
          })
        })
      },
      fetchRoleList() {
        getRoleList().then((response) => {
          this.remoteRoleList = response.data
        })
      },
    },
    data() {
      return {
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 25 },
        },
        userList: [],
        // data,
        columns,
        roleInfocolumns,
        // statusDescription,
        queryParam: {
          username: '',
        },
        pagination: {
          pageSize: 10,
          current: 1,
          pageSizeOptions: ['10', '20', '30'],
          total: 100,
        },
        remoteRoleList: [],
        userForm: {},
        editVisible: false,
      }
    },
  }
</script>
