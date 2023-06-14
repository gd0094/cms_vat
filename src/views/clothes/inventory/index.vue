<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>库存查询</span>
      </div>
      <el-form ref="inventoryForm" :inline="true" :model="inventoryParams">
        <el-row :gutter="2" type="flex" justify="space-between" align="center">
          <el-col :span="7">
            <el-form-item label="条码:" prop="barCode">
              <el-input
                v-model="inventoryParams.barCode"
                placeholder="请输入商品条码"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="名称:" prop="skuName">
              <el-input
                v-model="inventoryParams.skuName"
                placeholder="请输入商品名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="描述" prop="skuDesc">
              <el-input
                v-model="inventoryParams.skuDesc"
                placeholder="请选择商品描述"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item>
              <el-button
                v-hasAuthority="['product:skuInfo:query']"
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="handleQuery"
              >搜索</el-button>
              <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-button
        v-hasAuthority="['product:skuInfo:export']"
        type="warning"
        icon="el-icon-download"
        size="small"
        @click="handleExport"
      >导出</el-button>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          fixed
          label="ID"
          align="center"
          prop="skuId"
          width="65"
          sortable
        />
        <el-table-column label="条码" align="center" prop="barCode" sortable />
        <el-table-column
          label="名称"
          width="200"
          align="center"
          prop="skuName"
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" title="名称：" width="200" trigger="hover" :content="scope.row.skuName">
              <p slot="reference" class="ellipsis">{{ scope.row.skuName }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          width="200"
          align="center"
          prop="skuDesc"
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" title="描述：" width="200" trigger="hover" :content="scope.row.skuDesc">
              <p slot="reference" class="ellipsis">{{ scope.row.skuDesc }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="颜色"
          align="center"
          prop="attrKeys.颜色"
          sortable
        />
        <el-table-column label="尺寸" align="center" prop="attrKeys.尺寸" /> -->
        <el-table-column label="规格" align="center" prop="skuAttrList" width="100px">
          <template slot-scope="scope">
            <p v-for="(value, key) in scope.row.skuAttrList" :key="key">
              {{ key }} : {{ value }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="价格" align="center" prop="price" sortable />
        <el-table-column
          label="市场价格"
          width="100"
          align="center"
          prop="marketPrice"
          sortable
        />
        <el-table-column
          label="类别"
          align="center"
          prop="categoryName"
        />
        <el-table-column
          label="库存数量"
          width="100"
          align="center"
          prop="stock"
          sortable
        />
        <el-table-column
          label="状态"
          align="center"
          prop="publishStatus"
          sortable
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.publishStatus == '1'" size="medium">上架</el-tag>
            <el-tag v-else size="medium" type="warning">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="150" align="center" prop="image">
          <template slot-scope="scope">
            <el-carousel trigger="click" height="150px">
              <el-carousel-item v-for="item in scope.row.imageList" :key="item" indicator-position="none">
                <el-image :src="item" fit="cover" />
              </el-carousel-item>
            </el-carousel>
          </template>
        </el-table-column>
        <el-table-column label="库存数量" align="center" prop="stock" />
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column
          label="创建时间"
          width="150"
          align="center"
          prop="createTime"
          :formatter="formatDate"
        />
        <el-table-column label="修改者" align="center" prop="updateBy" />
        <el-table-column
          label="修改时间"
          width="150"
          align="center"
          prop="updateTime"
          :formatter="formatDate"
        />
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-hasAuthority="['product:skuInfo:edit']"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              v-hasAuthority="['product:skuInfo:remove']"
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页加载 -->
      <el-pagination
        :current-page="inventoryParams.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="inventoryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-count="total"
        style="float: right"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>
  </div>
</template>

<script>
import { listProductByPage, delProductById, exportExcel } from "@/api/product/SkuInfo";
import axios from 'axios'
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      //  查询款式参数
      inventoryParams: {
        currentPage: 1,
        pageSize: 5,
        barCode: "",
        skuName: "",
        skuDesc: "",
      },
      // 表格数据
      dataList: [],
      // 总页数
      total: 0,
      loading: false,
    };
  },
  // 生命周期-创建完成，可选
  created() {
    this.getList();
  },

  methods: {
    // 查询列表
    getList() {
      this.loading = true;
      // 结果复制this.dataList
      listProductByPage(this.inventoryParams).then((response) => {
        console.log(response);
        const list = response.data.data.data;
        list.forEach((item) => {
          item.skuAttrList = JSON.parse(item.skuAttrList);
          if (item.image) {
            item.imageList = item.image.split(",");
          }
        });
        this.dataList = list;
        this.total = response.data.data.totalPage;
        this.loading = false;
      });
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productId);
      this.single = selection.length !== 1;
    },
    // 搜索按钮操作
    handleQuery() {
      if (
        !this.inventoryParams.barCode &&
        !this.inventoryParams.skuName &&
        !this.inventoryParams.skuDesc
      ) {
        this.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
        return;
      }
      this.inventoryParams.currentPage = 1;
      this.getList();
    },
    // 重置表单
    resetQuery() {
      this.$refs.inventoryForm.resetFields();
      this.getList();
    },
    // 处理当前页面列表数量
    handleSizeChange(val) {
      this.inventoryParams.pageSize = val;
      this.getList();
    },
    // 处理分页
    handleCurrentChange(val) {
      this.inventoryParams.currentPage = val;
      this.getList();
    },
    // 修改
    handleUpdate(row){
      this.$router.push({
        path:"/clothes/message",
        query:{
          row:row,
          type:1
        },
      })
    },
    // 删除类别
    handleDelete(row) {
      // this.$message.warning('暂不支持该功能')
      // console.log(row);
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProductById(row.skuId).then((res) => {
            console.log("删除成功", res);
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 时间格式转化
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },
    handleExport() {
      exportExcel().then(response => {
        const contentDisposition = response.headers['content-disposition']
        const filename = contentDisposition.split("filename=")[1]
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', decodeURIComponent(filename))
        document.body.appendChild(link)
        link.click()
      }).catch(error => {
        this.$message.error('下载失败')
        console.log(error)
      })
      // axios({
      //   url: '/product/skuInfo/export',
      //   method: 'get',
      //   responseType: 'blob',
      //   headers: { Authorization: "Bearer " + getToken() }
      // }).then(response => {
      //   const contentDisposition = response.headers['content-disposition']
      //   const filename = contentDisposition.split("filename=")[1]
      //   const url = window.URL.createObjectURL(new Blob([response.data]))
      //   const link = document.createElement('a')
      //   link.href = url
      //   link.setAttribute('download', decodeURIComponent(filename))
      //   document.body.appendChild(link)
      //   link.click()
      // }).catch(error => {
      //   this.$message.error('下载失败')
      //   console.log(error)
      // })
    }
  },
};
</script>

<style lang="less" scoped>
// 取消走马灯下方指示条
/deep/ .el-carousel__indicators{
  display: none;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin: 1% 0;
  width: 100%;
}

.el-table {
  width: 100%;
}

.ellipsis{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}
</style>
