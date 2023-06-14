<template>
  <div class="app-container">
    <el-form>
      <el-form-item label="年份">
        <el-select v-model="params.year" placeholder="请选择年份">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>产品销量饼状图</span>
          </div>
          <div ref="left" style="height: 480px; margin: 0 auto;" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>月度销售额柱状图</span>
          </div>
          <div ref="right" style="height: 480px; margin: 0 auto;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCategoryPieSales,getMonthSales } from '@/api/sale/report'
export default {
  name: "Dashboard",
  data() {
    return {
      options: [{
          value: '2023',
          label: '2023'
        }, {
          value: '2022',
          label: '2022'
        }, {
          value: '2021',
          label: '2021'
        }, {
          value: '2020',
          label: '2020'
        }, {
          value: '2019',
          label: '2019'
        }],
      params:{
        year:"2023"
      }
    };
  },
   watch:{
    'params.year':{
      handler(){
        // 获取月份销量数据
         getMonthSales(this.params).then(res => {
          const list=res.data.data
          const mouthData=list.map(item =>  item.data)
          this.initBarChart(mouthData)
        })
      },
      immediate:true
    }
  },
  created() {},
  
  mounted() {
    // 获取类别饼图数据
    getCategoryPieSales().then(res => {
      const pieData = res.data.data
      this.initPieChart(pieData)
    })
  },
  methods: {
    initPieChart(pieData) {
      var pieChart = this.$echarts.init(this.$refs.left)
      var option = {
        title: {
          text: '热卖商品分析报表',
          subtext: '按产品类型统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '占所有产品的',
            type: 'pie',
            radius: '50%',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      option && pieChart.setOption(option)
    },
    /** 初始化柱状图 */
    initBarChart(mouthData){
      var pieChart = this.$echarts.init(this.$refs.right)
      var option = {
        title: {
          text: '月度销售额统计报表',
          subtext: '按月份统计',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: mouthData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            }
          }
        ]
      }
      option && pieChart.setOption(option)
    }
  },
};
</script>

<style></style>
