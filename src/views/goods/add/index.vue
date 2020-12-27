<template>
  <div class="index-container">
    <a-alert message="商品添加板块"></a-alert>
    <a-form
      name="custom-validation"
      ref="ruleForm"
      :rules="rules"
      :model="goodsForm"
      v-bind="layout"
      @finish="handleFinish"
      @finishFailed="handleFinishFailed"
    >
      <!-- :rules="rules" -->
      <a-form-item has-feedback label="商品名称" name="name">
        <a-input v-model:value="goodsForm.name" type="text" />
      </a-form-item>
      <a-form-item has-feedback label="商品描述" name="description">
        <a-input v-model:value="goodsForm.description" type="text" />
      </a-form-item>
      <a-form-item has-feedback label="商品单价" name="perPrice">
        <a-input-number
          v-model:value="goodsForm.perPrice"
          :formatter="
            (value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          "
          :parser="(value) => value.replace(/\$\s?|(,*)/g, '')"
        />
      </a-form-item>
      <a-form-item has-feedback label="商品库存" name="stock">
        <a-input-number
          id="inputNumber"
          v-model:value="goodsForm.stock"
          :min="0"
          :max="100000000"
        />
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="onSubmit">创建商品</a-button>
        <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import { saveGoods } from '@/api/goods'
  import { message } from 'ant-design-vue'
  export default {
    name: 'GoodsAdd',
    data() {
      return {
        goodsForm: {
          name: '',
          description: '',
          perPrice: 0,
          stock: 0,
        },
        rules: {
          name: [
            {
              required: true,
              message: '请输入名称',
              trigger: 'blur',
            },
          ],
          description: [
            {
              required: true,
              message: '请输入描述',
              trigger: 'blur',
            },
          ],
        },
        layout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        },
      }
    },
    methods: {
      handleFinish(values) {
        console.log(values)
      },
      handleFinishFailed(errors) {
        console.log(errors)
      },
      onSubmit() {
        this.$refs.ruleForm
          .validate()
          .then(() => {
            saveGoods(this.goodsForm).then((response) => {
              message.success(response.msg)
              this.$router.push('/goods/table')
            })
            console.log('values', this.goodsForm)
          })
          .catch((error) => {
            console.log('error', error)
          })
      },
      resetForm() {
        this.$refs.ruleForm.resetFields()
      },
    },
  }
</script>
