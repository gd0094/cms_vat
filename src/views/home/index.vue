<template>
  <div class="dashboard-container">
    <el-descriptions border>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-user" />
          用户名
        </template>
        {{ name }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-mobile-phone" />
          手机号
        </template>
        {{ phone }}
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          <i class="el-icon-location-outline" />
          角色权限
        </template>
        {{ roles[0].roleKey }}
      </el-descriptions-item>
    </el-descriptions>
    <div class="dashboard-editor-container">
      <panel-group />
    </div>
    <div ref="chart" style="width:100%;height:200px" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import PanelGroup from "../report/dashboard/PanelGroup.vue";
export default {
  name: "Home",
  components: {
    PanelGroup,
  },
  computed: {
    ...mapGetters(["name", "roles", "authorities", "phone"]),
  },
  mounted(){
    this.initCharts()
  },
  methods: {
    initCharts() {
      var myChart = this.$echarts.init(this.$refs.chart)
      var option = {
        graphic: {
          elements: [
            {
              type: "text",
              left: "center",
              top: "center",
              style: {
                text: "MISP",
                fontSize: 80,
                fontWeight: "bold",
                lineDash: [0, 200],
                lineDashOffset: 0,
                fill: "transparent",
                stroke: "#000",
                lineWidth: 1,
              },
              keyframeAnimation: {
                duration: 5000,
                loop: true,
                keyframes: [
                  {
                    percent: 0.7,
                    style: {
                      fill: "transparent",
                      lineDashOffset: 200,
                      lineDash: [200, 0],
                    },
                  },
                  {
                    // Stop for a while.
                    percent: 0.8,
                    style: {
                      fill: "transparent",
                    },
                  },
                  {
                    percent: 1,
                    style: {
                      fill: "black",
                    },
                  },
                ],
              },
            },
          ],
        },
      };
      option && myChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-editor-container {
  padding: 25px 0;
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
