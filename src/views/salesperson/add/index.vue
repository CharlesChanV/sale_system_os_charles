<template>
  <div class="index-container">
    <a-alert message="销售人员添加板块"></a-alert>
    <a-form
      ref="ruleForm"
      :model="customerForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-item label="销售人员名称" required has-feedback name="name">
        <a-input v-model:value="customerForm.name" />
      </a-form-item>
      <a-form-item label="联系方式" required has-feedback name="phone">
        <a-input v-model:value="customerForm.phone" />
      </a-form-item>
      <a-form-item label="销售人员邮箱" required has-feedback name="email">
        <a-input v-model:value="customerForm.email" />
      </a-form-item>
      <a-form-item label="用户" required has-feedback name="userId">
        <a-select
          show-search
          v-model:value="customerForm.userId"
          placeholder="input search text"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleUserSearch"
        >
          <!-- @change="handleSalespersonChange" -->
          <a-select-option
            v-for="d in userData"
            :key="d.userId"
            :value="d.userId"
          >
            {{ d.username + ' | ' + d.userId }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="submitCustomer">创建销售人员</a-button>
        <a-button style="margin-left: 10px" @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { saveSalesperson } from '@/api/salesperson'
  import { getUserList } from '@/api/user'
  import { message } from 'ant-design-vue'
  export default {
    name: 'SalespersonAdd',
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        userData: [],
        customerForm: {
          name: '',
          phone: '',
          email: '',
          status: 1,
          userId: '',
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入姓名',
              trigger: 'blur',
            },
          ],
          phone: [
            {
              required: true,
              message: '请输入联系方式',
              trigger: 'blur',
            },
            {
              len: 11,
              message: '联系方式有误',
              trigger: 'blur',
            },
          ],
          email: [
            {
              required: true,
              message: '请输入邮箱',
              trigger: 'blur',
            },
            {
              type: 'email',
              message: '邮箱格式有误',
              trigger: 'blur',
            },
          ],
        },
      }
    },
    methods: {
      submitCustomer() {
        this.$refs.ruleForm
          .validate()
          .then(() => {
            console.log('values', this.customerForm)
            saveSalesperson(this.customerForm).then((response) => {
              message.success(response.msg)
              this.$router.push('/salesperson/table')
            })
          })
          .catch((error) => {
            console.log('error', error)
          })
      },
      handleUserSearch(data) {
        getUserList({ username: data }).then((response) => {
          message.success('搜索成功')
          this.userData = response.data
        })
      },
      cancel() {
        this.$router.push('/salesperson/table')
      },
    },
  }
</script>
