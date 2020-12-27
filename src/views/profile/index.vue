<template>
  <div>
    <a-row>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="10">
        <a-card title="个人信息" style="width: 500px">
          <a-form :model="userinfo">
            <a-form-item label="用户ID">
              <a-input v-model:value="userinfo.userId" readonly>
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="用户名">
              <a-input v-model:value="userinfo.username" readonly>
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="头像">
              <a-avatar :size="64">
                <!-- <template #icon><UserOutlined /></template> -->
                <template #icon>
                  <img :src="userinfo.avatar" alt="#" />
                </template>
              </a-avatar>
            </a-form-item>
            <a-form-item label="新密码">
              <a-input v-model:value="newPassword" type="password">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" @click="changePassword">
                更改密码
              </a-button>
            </a-form-item>
            <!-- <a-form-item>
              <a-input
                v-model:value="userinfo.password"
                type="password"
                placeholder="Password"
              >
                <template v-slot:prefix>
                  <LockOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item> -->
            <!-- <a-form-item>
              <a-button type="primary" html-type="submit">更新</a-button>
            </a-form-item> -->
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="10">
        <a-card v-if="isAdmin" title="管理员信息" style="width: 500px">
          <a-form
            :model="userinfo.adminInfo"
            @submit="handleAdminSubmit"
            @submit.prevent
          >
            <a-form-item label="管理员ID" v-if="userinfo.adminInfo.adminId">
              <a-input v-model:value="userinfo.adminInfo.adminId" disabled>
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="userinfo.adminInfo.name">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="联系方式">
              <a-input v-model:value="userinfo.adminInfo.phone">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model:value="userinfo.adminInfo.email">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="地址">
              <a-input v-model:value="userinfo.adminInfo.address">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">更新</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="10">
        <a-card v-if="isCustomer" title="客户信息" style="width: 500px">
          <a-form
            :model="userinfo.customerInfo"
            @submit="handleCustomerSubmit"
            @submit.prevent
          >
            <!-- handleCustomerSubmit -->
            <a-form-item label="客户ID" v-if="userinfo.customerInfo.customerId">
              <a-input
                v-model:value="userinfo.customerInfo.customerId"
                disabled
              >
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="userinfo.customerInfo.name">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="联系方式">
              <a-input v-model:value="userinfo.customerInfo.phone">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model:value="userinfo.customerInfo.email">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="地址">
              <a-input v-model:value="userinfo.customerInfo.address">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">更新</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="0" :md="0" :sm="12" :lg="14" :xl="10">
        <a-card v-if="isSalesperson" title="销售信息" style="width: 500px">
          <a-form
            :model="userinfo.salespersonInfo"
            @submit="handleSalespersonSubmit"
            @submit.prevent
          >
            <a-form-item
              label="销售ID"
              v-if="userinfo.salespersonInfo.salespersonId"
            >
              <a-input
                v-model:value="userinfo.salespersonInfo.salespersonId"
                disabled
              >
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="姓名">
              <a-input v-model:value="userinfo.salespersonInfo.name">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="联系方式">
              <a-input v-model:value="userinfo.salespersonInfo.phone">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="邮箱">
              <a-input v-model:value="userinfo.salespersonInfo.email">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item label="地址">
              <a-input v-model:value="userinfo.salespersonInfo.address">
                <template v-slot:prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button type="primary" html-type="submit">更新</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import { UserOutlined } from '@ant-design/icons-vue'
  // import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
  import { getUserInfo, changePassword } from '@/api/user'
  import { saveAdminInfo } from '@/api/admin'
  import { updateCustomer, saveCustomer } from '@/api/customer'
  import { updateSalesperson, saveSalesperson } from '@/api/salesperson'
  import { message } from 'ant-design-vue'

  export default {
    name: 'Profile',
    components: {
      UserOutlined,
      // LockOutlined,
    },
    data() {
      return {
        userinfo: {},
        redirect: undefined,
        isAdmin: false,
        isSalesperson: false,
        isCustomer: false,
        newPassword: '',
      }
    },
    mounted() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        getUserInfo().then((response) => {
          this.userinfo = response.data
          response.data.roles.map((item) => {
            if (item && item.indexOf('admin') > 0) {
              this.isAdmin = true
              if (this.userinfo.adminInfo == null) {
                this.userinfo.adminInfo = {
                  adminId: null,
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                }
              }
            }
            if (item == 'ROLE_sale_person') {
              this.isSalesperson = true
              if (this.userinfo.salespersonInfo == null) {
                this.userinfo.salespersonInfo = {
                  salespersonId: null,
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                }
              }
            }
            if (item == 'ROLE_customer') {
              this.isCustomer = true
              if (this.userinfo.customerInfo == null) {
                this.userinfo.customerInfo = {
                  customerId: null,
                  name: '',
                  phone: '',
                  email: '',
                  address: '',
                }
              }
            }
          })
        })
      },
      handleAdminSubmit() {
        this.userinfo.adminInfo.userId = this.userinfo.userId
        saveAdminInfo(this.userinfo.adminInfo).then((response) => {
          message.success(response.msg)
        })
      },
      handleCustomerSubmit() {
        this.userinfo.customerInfo.userId = this.userinfo.userId
        if (this.userinfo.customerInfo.customerId == null) {
          saveCustomer(this.userinfo.customerInfo).then((response) => {
            message.success(response.msg)
          })
          return true
        }
        updateCustomer(this.userinfo.customerInfo).then((response) => {
          message.success(response.msg)
        })
      },
      handleSalespersonSubmit() {
        this.userinfo.salespersonInfo.userId = this.userinfo.userId
        if (this.userinfo.salespersonInfo.salespersonId == null) {
          saveSalesperson(this.userinfo.salespersonInfo).then((response) => {
            message.success(response.msg)
          })
          return true
        }
        updateSalesperson(this.userinfo.salespersonInfo).then((response) => {
          message.success(response.msg)
        })
      },
      changePassword() {
        if (this.newPassword.trim() == '') {
          message.warning('尚未输入新密码')
          return false
        }
        changePassword({ password: this.newPassword }).then((response) => {
          message.success(response.msg)
          this.newPassword = ''
        })
      },
    },
  }
</script>
