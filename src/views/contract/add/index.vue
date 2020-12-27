<template>
  <div class="index-container">
    <a-alert message="合同添加板块"></a-alert>
    <a-form
      ref="ruleForm"
      :model="contractForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
    >
      <a-form-item label="合同名称" required has-feedback name="contractName">
        <a-input v-model:value="contractForm.contractName" />
      </a-form-item>
      <a-form-item label="甲方" required has-feedback name="firstParty">
        <a-input v-model:value="contractForm.firstParty" />
      </a-form-item>
      <a-form-item label="乙方" required has-feedback name="secondParty">
        <a-input v-model:value="contractForm.secondParty" />
      </a-form-item>
      <!-- <a-form-item label="Activity zone">
        <a-select
          v-model:value="form.region"
          placeholder="please select your zone"
        >
          <a-select-option value="shanghai">Zone one</a-select-option>
          <a-select-option value="beijing">Zone two</a-select-option>
        </a-select>
      </a-form-item> -->
      <a-form-item label="开始时间" required has-feedback name="startDate">
        <a-date-picker
          v-model:value="contractForm.startDate"
          show-time
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          @change="onStartDateChange"
        />
        <!-- type="date" -->
      </a-form-item>
      <a-form-item label="截止时间" required has-feedback name="endDate">
        <a-date-picker
          v-model:value="contractForm.endDate"
          show-time
          placeholder="Pick a date"
          style="width: 100%"
          format="YYYY-MM-DD HH:mm:ss"
          @change="onEndDateChange"
        />
        <!-- type="date" -->
      </a-form-item>
      <a-form-item label="销售人员" required has-feedback name="salespersonId">
        <a-select
          show-search
          v-model:value="contractForm.salespersonId"
          placeholder="input search text"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleSalespersonSearch"
        >
          <!-- @change="handleSalespersonChange" -->
          <a-select-option
            v-for="d in salespersonData"
            :key="d.salespersonId"
            :value="d.salespersonId"
          >
            {{ d.salespersonId + ' | ' + d.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="客户" required has-feedback name="customerId">
        <a-select
          show-search
          v-model:value="contractForm.customerId"
          placeholder="input search text"
          style="width: 200px"
          :default-active-first-option="false"
          :show-arrow="false"
          :filter-option="false"
          :not-found-content="null"
          @search="handleCustomerSearch"
        >
          <!-- @change="handleChange" -->
          <a-select-option
            v-for="d in customerData"
            :key="d.customerId"
            :value="d.customerId"
          >
            {{ d.customerId + ' | ' + d.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="Instant delivery">
        <a-switch v-model:checked="contractForm.delivery" />
      </a-form-item>
      <a-form-item label="Activity type">
        <a-checkbox-group v-model:value="contractForm.type">
          <a-checkbox value="1" name="type">Online</a-checkbox>
          <a-checkbox value="2" name="type">Promotion</a-checkbox>
          <a-checkbox value="3" name="type">Offline</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="Resources">
        <a-radio-group v-model:value="contractForm.resource">
          <a-radio value="1">Sponsor</a-radio>
          <a-radio value="2">Venue</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="Activity form">
        <a-input v-model:value="contractForm.desc" type="textarea" />
      </a-form-item> -->
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">创建</a-button>
        <a-button style="margin-left: 10px" @click="cancel">取消</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
  import { message } from 'ant-design-vue'
  import { saveContract } from '@/api/contract'
  import { getCustomerList } from '@/api/customer'
  import { getSalespersonList } from '@/api/salesperson'
  export default {
    name: 'ContractAdd',
    data() {
      return {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
        contractForm: {
          contractName: '',
          firstParty: '',
          secondParty: '',
          startDate: undefined,
          endDate: undefined,
          salespersonId: undefined,
          customerId: undefined,
        },
        rules: {
          contractName: [
            {
              required: true,
              message: '请输入合同名称',
              trigger: 'blur',
            },
          ],
          firstParty: [
            {
              required: true,
              message: '请输入甲方',
              trigger: 'blur',
            },
          ],
          secondParty: [
            {
              required: true,
              message: '请输入乙方',
              trigger: 'blur',
            },
          ],
          startDate: [
            {
              required: true,
              message: '请选择开始日期',
              trigger: 'blur',
              // type: 'object',
            },
          ],
          endDate: [
            {
              required: true,
              message: '请选择截止日期',
              trigger: 'blur',
              // type: 'object',
            },
          ],
          salespersonId: [
            {
              required: true,
              message: '请输入销售人员',
              trigger: 'blur',
              type: 'number',
            },
          ],
          customerId: [
            {
              required: true,
              message: '请输入客户',
              trigger: 'blur',
              type: 'number',
            },
          ],
        },
        salespersonData: [],
        customerData: [],
      }
    },
    methods: {
      onSubmit() {
        message.info('正在处理中请稍后')
        this.$refs.ruleForm
          .validate()
          .then(() => {
            message.success('验证通过')
            console.log('values', this.contractForm)
            this.addContract()
          })
          .catch((error) => {
            message.warning('验证异常')
            console.log('error', error)
          })
        console.log('submit!', this.contractForm)
      },
      addContract() {
        saveContract(this.contractForm).then((response) => {
          message.info(response.msg)
          if (response.code == 0 && response.data == 1) {
            this.$router.push('/contract/table')
          }
        })
      },
      handleSalespersonSearch(data) {
        console.log(data)
        getSalespersonList({ name: data }).then((response) => {
          this.salespersonData = response.data
        })
      },
      // handleSalespersonChange(value) {
      //   console.log(value)
      // },
      handleCustomerSearch(data) {
        console.log(data)
        getCustomerList({ name: data }).then((response) => {
          this.customerData = response.data
        })
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
    },
  }
</script>
