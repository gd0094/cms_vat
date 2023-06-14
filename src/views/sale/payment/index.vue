<!-- eslint-disable vue/html-closing-bracket-newline -->
<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm">
        <el-row :gutter="2" type="flex" justify="space-around" align="center">
          <el-col :span="7" :offset="2">
            <el-form-item label="支付编号:" prop="paymentId">
              <el-input
                v-model="searchForm.paymentId"
                placeholder="请输入支付编号"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单编号:" prop="orderId">
              <el-input
                v-model="searchForm.orderId"
                placeholder="请输入订单编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button
                v-hasAuthority="['order:payment:query']"
                type="primary"
                icon="el-icon-search"
                size="small"
                @click="search"
              >搜索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                size="small"
                @click="resetForm('searchForm')"
              >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据表格 -->
    <el-card>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          fixed
          label="支付Id"
          align="center"
          prop="paymentId"
          sortable
          width="90"
        />
        <el-table-column
          label="支付编号"
          align="center"
          prop="paymentNo"
        >
         <template slot-scope="scope">
            <el-popover placement="top-start" title="支付编号:" width="200" trigger="hover" :content="scope.row.paymentNo">
              <p slot="reference" class="ellipsis">{{ scope.row.paymentNo }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="订单Id" align="center" prop="orderId" sortable width="90" />
        <el-table-column label="订单编号" align="center" prop="orderNo">
           <template slot-scope="scope">
            <el-popover placement="top-start" title="订单编号:" width="200" trigger="hover" :content="scope.row.orderNo">
              <p slot="reference" class="ellipsis">{{ scope.row.orderNo }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="支付时间" align="center" prop="paymentTime" width="100" />
        <el-table-column label="支付方式" align="center" prop="payMethod" width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.payMethod == '1'" size="medium" type="warning">现金支付</el-tag>
            <el-tag v-else size="medium">支付宝支付</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="支付金额" align="center" prop="payAmount" />
        <el-table-column label="总金额" align="center" prop="totalAmount" />
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="100" />
        <el-table-column label="修改者" align="center" prop="updateBy" />
        <el-table-column label="修改时间" align="center" prop="updateTime" width="100" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button
            >
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页加载 -->
      <el-pagination
        style="float: right"
        :current-page="page.currentPage"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="page.totalData"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </el-card>

    <!-- 添加修改对话框 -->
    <el-dialog :visible.sync="popup.open" width="500px" append-to-body @close="cancel">
      <el-form ref="updateForm" :model="updateForm" label-width="120px">
        <!-- 数据编辑表单组件 -->
        <el-form-item label="类别名称" prop="categoryName">
          <el-input
            v-model="updateForm.categoryName"
            placeholder="请输入类别名称"
          />
        </el-form-item>
        <el-form-item label="类别描述" prop="categoryDesc">
          <el-input
            v-model="updateForm.categoryDesc"
            placeholder="请输入类别描述"
          />
        </el-form-item>
      </el-form>
      <!-- 数据提交操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPaymentByPage,
} from "@/api/sale/orderPayment";
import { parseTime } from "@/utils/index.js";
export default {
  data() {
    return {
      loading: false,
      // 搜索表单
      searchForm: {
        paymentId: null,
        orderId: null,
      },
      // 表格数据
      dataList: [],
      // 弹出框属性
      popup: {
        open: false,
        type: "", // 1为添加，2为修改
      },
      // 弹出框表单
      updateForm: {
        categoryId: "",
        categoryName: "",
        categoryDesc: "",
      },
      // 分页数据
      page: {
        currentPage: 1,
        totalPage: 0,
        pageSize: 5,
        totalData: 0,
      },
    };
  },
  computed: {
    // 分页查询参数
    listByPageParams() {
      return {
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        categoryName: this.searchForm.categoryName,
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true;
      listPaymentByPage(this.listByPageParams).then((res) => {
        console.log(res);
        const list = res.data.data;
        console.log("获取列表", list);
        list.data.forEach((item) => {
          // 时间格式处理
          item.paymentTime = parseTime(item.paymentTime).substring(0,10)
          item.createTime = parseTime(item.createTime).substring(0, 10);
          item.updateTime = parseTime(item.updateTime).substring(0, 10);
        });
        this.loading = false;
        this.dataList = list.data;
        this.page.currentPage = list.currentPage;
        this.page.totalData = list.totalData;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.productId);
      this.single = selection.length !== 1;
    },
    // 处理列表显示数量
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    // 处理当前页数
    handleCurrentChange(val) {
      console.log(val);
      this.page.currentPage = val;
      this.getList();
    },
    // 查询
    search() {
      this.$message.warning('暂不支持该功能')
      return
      // if (!this.searchForm.categoryId && !this.searchForm.categoryName) {
      //   this.$message({
      //     message: "请输入搜索条件",
      //     type: "warning",
      //   });
      //   return;
      // }
      // if (this.searchForm.categoryId && this.searchForm.categoryName) {
      //   this.$message({
      //     message: "只支持单独一种搜索",
      //     type: "warning",
      //   });
      //   return;
      // }
      // // 根据id搜索
      // if (this.searchForm.categoryId) {
      //   listById(this.searchForm.categoryId).then((res) => {
      //     const list = res.data.data;
      //     console.log("根据id搜索", list);
      //     list.createTime = parseTime(list.createTime).substring(0, 10);
      //     list.updateTime = parseTime(list.updateTime).substring(0, 10);
      //     this.dataList = [];
      //     this.$set(this.dataList, 0, list);
      //   });
      // }
      // // 根据名称搜索
      // if (this.searchForm.categoryName) {
      //   this.getList();
      // }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.page.currentPage = 1;
      this.getList();
    },
    // 添加类别
    handleAdd() {
      this.popup.open = true;
      this.popup.type = 1;
    },
    // 修改类别
    handleUpdate(row) {
       this.$message.warning('暂不支持该功能')
      return
      // console.log(row);
      // this.updateForm.categoryId = row.categoryId;
      // this.updateForm.categoryName = row.categoryName;
      // this.updateForm.categoryDesc = row.categoryDesc;
      // this.popup.open = true;
      // this.popup.type = 2;
    },
    // 删除类别
    handleDelete(row) {
       this.$message.warning('暂不支持该功能')
      return
      // console.log(row);
      // this.$confirm("此操作将永久删除类别, 是否继续?", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "warning",
      // })
      //   .then(() => {
      //     delCategory(row.categoryId).then((res) => {
      //       console.log("删除成功", res);
      //       if (res.data.code == 200) {
      //         this.$message({
      //           type: "success",
      //           message: "删除成功!",
      //         });
      //         this.getList();
      //       } else {
      //         this.$message.error("删除失败");
      //       }
      //     });
      //   })
      //   .catch(() => {
      //     this.$message({
      //       type: "info",
      //       message: "已取消删除",
      //     });
      //   });
    },
    // 添加修改弹出框-确定按钮
    submitForm() {
      if (!this.updateForm.categoryName) {
        this.$message({
          type: "warn",
          message: "请输入类别名!",
        });
        return;
      }
      // 添加
      if (this.popup.type == 1) {
        addCategory(this.updateForm)
          .then((res) => {
            if (res.data.code == "200") {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.getList();
            } else {
              this.$message.error("添加失败");
              console.log(res);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.popup.open = false;
            this.updateForm.categoryName = "";
            this.updateForm.categoryDesc = "";
          });
      } else {
        // 修改
        updateCategory(this.updateForm)
          .then((res) => {
            console.log(res);
            if (res.data.code == "200") {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.getList();
            } else {
              this.$message.error("修改失败");
              // console.log(res);
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.popup.open = false;
            this.updateForm = this.$options.data().updateForm;
          });
      }
    },
    // 添加修改弹出框-取消按钮
    cancel() {
      this.popup.open = false;
      this.updateForm = this.$options.data().updateForm;
    },
  },
};
</script>

<style>
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
  line-clamp: 1;
  -webkit-line-clamp: 1;
}
</style>
