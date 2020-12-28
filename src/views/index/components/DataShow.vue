<template>
  <div style="padding: 30px">
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="合同数量"
            :value="showdata.contractCount"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="采购清单数量"
            :value="showdata.purchaseCount"
            class="demo-class"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <!-- <arrow-down-outlined /> -->
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="客户人数"
            :value="showdata.customerCount"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="销售人员人数"
            :value="showdata.salespersonCount"
            class="demo-class"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <!-- <arrow-down-outlined /> -->
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="商品数量"
            :value="showdata.goodsCount"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="进货单量"
            :value="showdata.goodsInCount"
            class="demo-class"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <!-- <arrow-down-outlined /> -->
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-statistic
            title="用户量"
            :value="showdata.userCount"
            :value-style="{ color: '#3f8600' }"
            style="margin: 10px"
          >
            <template #prefix>
              <arrow-up-outlined />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col :span="12">
        <a-card>
          <a-form layout="inline">
            <a-form-item>
              <a-input-search
                v-model:value="queryParam.customerId"
                placeholder="客户ID"
                @search="searchStatistics"
              >
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-search>
            </a-form-item>
            <a-form-item>
              <a-input-search
                v-model:value="queryParam.salespersonId"
                placeholder="销售人员ID"
                @search="searchStatistics"
              >
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-search>
            </a-form-item>
          </a-form>
          <div>
            <a-statistic
              title="合同数"
              :value="
                searchStatisticsData.contractCount == null
                  ? '/'
                  : searchStatisticsData.contractCount
              "
              style="margin-right: 50px"
            />
            <a-statistic
              title="采购清单数"
              :value="
                searchStatisticsData.purchaseCount == null
                  ? '/'
                  : searchStatisticsData.purchaseCount
              "
            />
            <a-statistic
              title="客户数"
              :value="
                searchStatisticsData.customerCount == null
                  ? '/'
                  : searchStatisticsData.customerCount
              "
            />
          </div>
          <!-- <pre>{{ searchStatisticsData }}</pre> -->
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card>
          <a-form layout="inline">
            <a-form-item>
              <a-input-search
                v-model:value="queryParam.goodsId"
                placeholder="商品ID"
                @search="searchGoodsStatistics"
              >
                <template #prefix>
                  <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
                </template>
              </a-input-search>
            </a-form-item>
          </a-form>
          <div>
            <a-statistic
              title="总售出量"
              :value="
                searchGoodsStatisticsData.totalCount == null
                  ? '/'
                  : searchGoodsStatisticsData.totalCount
              "
              style="margin-right: 50px"
            />
            <a-statistic
              title="总售出额"
              :value="
                searchGoodsStatisticsData.totalPrice == null
                  ? '/'
                  : searchGoodsStatisticsData.totalPrice
              "
            />
            <a-statistic
              title="发货单数目"
              :value="
                searchGoodsStatisticsData.purchaseItemCount == null
                  ? '/'
                  : searchGoodsStatisticsData.purchaseItemCount
              "
            />
            <a-statistic
              title="采购清单数目"
              :value="
                searchGoodsStatisticsData.purchaseCount == null
                  ? '/'
                  : searchGoodsStatisticsData.purchaseCount
              "
            />
          </div>
          <!-- <pre>{{ searchGoodsStatisticsData }}</pre> -->
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  // import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons-vue'
  import { ArrowUpOutlined } from '@ant-design/icons-vue'
  import {
    getBaseStatistics,
    searchStatistics,
    searchGoodsStatistics,
  } from '@/api/statistics'
  import { message } from 'ant-design-vue'
  // import { Bar } from '@antv/g2plot'

  export default {
    components: {
      ArrowUpOutlined,
      // ArrowDownOutlined,
    },
    mounted() {
      getBaseStatistics().then((response) => {
        this.showdata = response.data
      })
    },
    methods: {
      searchStatistics() {
        searchStatistics(this.queryParam).then((response) => {
          message.success(response.msg)
          this.searchStatisticsData = response.data
        })
      },
      searchGoodsStatistics() {
        searchGoodsStatistics(this.queryParam.goodsId).then((response) => {
          message.success(response.msg)
          this.searchGoodsStatisticsData = response.data
        })
      },
    },
    data() {
      return {
        showdata: {},
        queryParam: {
          customerId: undefined,
          salespersonId: undefined,
          goodsId: undefined,
        },
        searchStatisticsData: {},
        searchGoodsStatisticsData: {},
      }
    },
  }
</script>
