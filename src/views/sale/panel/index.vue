<template>
  <div>
    <el-card>
      <!-- 搜索栏 -->
      <div class="search-container">
        <el-input
          v-model="searchValue"
          prefix-icon="el-icon-search"
          placeholder="请输入商品编号"
        />
        <el-button type="primary" plain @click="search">搜索</el-button>
      </div>
    </el-card>
    <!-- 主体 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 图片展示 -->
        <el-col :span="8" class="image-container">
          <div>
            <el-image
              slot="error"
              style="width: 100%; height: 250px"
              :src="currentUrl"
              fit="cover"
            />
          </div>
          <el-carousel
            :interval="4000"
            type="card"
            height="100px"
            @change="carouselChange"
          >
            <el-carousel-item v-for="(item, index) in imgList" :key="index">
              <el-image :src="item.url" fit="fit" />
            </el-carousel-item>
          </el-carousel>
        </el-col>

        <!-- 商品信息 -->
        <el-col :span="12" class="message-container">
          <h2>{{ message.title }}</h2>
          <div class="price">
            <span>价格：</span>
            <span style="font-size: 30px">¥{{ message.price }}</span>
          </div>
          <div>
            <span>尺码：</span>
            <el-radio-group
              v-model="message.radio"
              size="small"
              style="margin-top: 1%"
            >
              <el-radio label="1" border>S</el-radio>
              <el-radio label="2" border>M</el-radio>
              <el-radio label="3" border>L</el-radio>
              <el-radio label="4" border>XL</el-radio>
              <el-radio label="5" border>XXL</el-radio>
            </el-radio-group>
          </div>
          <div>
            <span>颜色：</span>
            <el-select v-model="message.color" placeholder="请选择颜色">
              <el-option
                v-for="item in colorOption"
                :key="item.id"
                :label="item.name"
                :value="item.name"
                @keyup.enter.native="handleQuery"
              />
            </el-select>
          </div>
          <div>
            <span>数量：</span>
            <el-input-number
              v-model="message.num"
              size="small"
              :min="1"
              :max="100"
            />
          </div>
          <div style="align-self: center">
            <el-button type="primary" @click="placeOrder">下单</el-button>
            <el-button type="warning" @click="checkInventory">查询库存</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 搜索框内容
      searchValue: "",
      currentUrl:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      imgList: [
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        },
        {
          url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        },
        {
          url: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        },
        {
          url: "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        },
      ],
      message: {
        title: "山系机能ins户外女外套国潮复古防风冲锋衣宽松男夹克",
        price: "143.00",
        radio: "1",
        color: "",
        num: 1,
      },
      // 颜色选择框
      colorOption: [
        {
          id: 1,
          name: "蓝色",
        },
        {
          id: 2,
          name: "黄色",
        },
        {
          id: 3,
          name: "绿色",
        },
        {
          id: 4,
          name: "黑色",
        },
        {
          id: 5,
          name: "白色",
        },
        {
          id: 6,
          name: "灰色",
        },
        {
          id: 7,
          name: "红色",
        },
      ],
    };
  },
  methods: {
    search() {
      console.log("搜索");
    },
    // 下单
    placeOrder() {
      if (this.message.color == "") {
        alert("请选择颜色");
        return;
      }
      this.$confirm("确认要下单？")
        .then((_) => {
          done();
          console.log("下订单", this.message);
        })
        .catch((_) => {});
    },
    // 查询余额
    checkInventory() {
      console.log("查询余额");
    },
    // 图片幻彩灯切换
    carouselChange(newValue, oldValue) {
      this.currentUrl = this.imgList[newValue].url;
    },
  },
};
</script>

<style lang="less" scoped>
.search-container {
  display: flex;
  justify-content: center;
  margin: 1% 30%;
  width: 50%;
}
.image-container {
  margin: 2% 5% 0% 8%;
  padding: 2%;
}
.message-container {
  margin: 2% 0%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  .price {
    color: rgb(255, 79, 0);
  }
  div {
    margin: 1%;
  }
}
</style>
