<template>
  <el-row :gutter="40">
    <el-col :xs="12" :sm="12" :lg="6">
      <el-card class="box-card">
        <div slot="header">
          <span>会员总数</span>
        </div>
        <div>
          <count-to :start-val="0" :end-val="count.memberCount" :duration="2600" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <el-card class="box-card">
        <div slot="header">
          <span>订单总数</span>
        </div>
        <div>
          <count-to :start-val="0" :end-val="count.orderCount" :duration="3000" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <el-card class="box-card">
        <div slot="header">
          <span>总销售额</span>
        </div>
        <div>
          <count-to :start-val="0" :end-val="count.totalSales" :duration="3200" />
        </div>
      </el-card>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6">
      <el-card class="box-card">
        <div slot="header">
          <span>库存总数</span>
        </div>
        <div>
          <count-to :start-val="0" :end-val="count.stockCount" :duration="3600" />
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import CountTo from 'vue-count-to'
import { getMemberCount } from '@/api/member/member'
import { getStockCount } from '@/api/product/SkuInfo'
import { getOrderCount, getTotalSales } from '@/api/sale/sale'
export default {
  components: {
    CountTo
  },
  data() {
    return {
      count: { 
        memberCount: 0, 
        orderCount: 0, 
        stockCount: 0, 
        totalSales: 0
      }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      getMemberCount().then(res => {
        this.count.memberCount = res.data.data;
      })
      getStockCount().then(res => {
        this.count.stockCount = res.data.data;
      })
      getOrderCount().then(res => {
        this.count.orderCount = res.data.data;
      })
      getTotalSales().then(res => {
        this.count.totalSales = res.data.data;
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
