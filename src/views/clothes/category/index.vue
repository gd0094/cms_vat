<!-- eslint-disable vue/html-closing-bracket-newline -->
<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>类别查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm">
        <el-row :gutter="2" type="flex" justify="space-around" align="center">
          <el-col :span="6">
            <el-form-item label="编号:" prop="categoryId">
              <el-input
                v-model="searchForm.categoryId"
                placeholder="请输入类别编号"
                size="small"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="名称:" prop="categoryName">
              <el-input
                v-model="searchForm.categoryName"
                placeholder="请输入类别名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button
                v-hasAuthority="['product:category:query']"
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
              <el-button
                v-hasAuthority="['product:category:add']"
                type="success"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="handleAdd"
              >新建类别</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 数据表格 -->
    <el-card>
      <el-row :gutter="10" class="mb8">

        <el-col :span="1.5">
          <el-button
            v-hasAuthority="['product:category:template']"
            type="info"
            icon="el-icon-upload2"
            size="small"
            @click="handleImport"
          >导入</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-hasAuthority="['product:category:export']"
            type="warning"
            icon="el-icon-download"
            size="small"
            @click="handleExport"
          >导出</el-button>
        </el-col>
          
      </el-row>
      <el-table v-loading="loading" :data="dataList">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column
          fixed
          label="ID"
          align="center"
          prop="categoryId"
          sortable
        />
        <el-table-column
          label="名称"
          align="center"
          prop="categoryName"
          sortable
        />
        <el-table-column label="描述" align="center" prop="categoryDesc" />
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="修改者" align="center" prop="updateBy" />
        <el-table-column label="修改时间" align="center" prop="updateTime" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-hasAuthority="['product:category:edit']"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button
            >
            <el-button
              v-hasAuthority="['product:category:remove']"
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

    <!-- 类别导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div slot="tip" class="el-upload__tip text-center">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listByPage,
  listById,
  addCategory,
  updateCategory,
  delCategory,
  exportExcel,
  templateExcel
} from "@/api/product/category";
import { parseTime } from "@/utils/index.js";
import { getToken } from "@/utils/auth";
import axios from 'axios'
export default {
  data() {
    return {
      loading: false,
      // 搜索表单
      searchForm: {
        categoryId: null,
        categoryName: null,
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
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: "http://43.139.27.107:1534/system/user/import"
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
      listByPage(this.listByPageParams).then((res) => {
        const list = res.data.data;
        console.log("获取列表", list);
        list.data.forEach((item) => {
          // 时间格式处理
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
      if (!this.searchForm.categoryId && !this.searchForm.categoryName) {
        this.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
        return;
      }
      if (this.searchForm.categoryId && this.searchForm.categoryName) {
        this.$message({
          message: "只支持单独一种搜索",
          type: "warning",
        });
        return;
      }
      // 根据id搜索
      if (this.searchForm.categoryId) {
        listById(this.searchForm.categoryId).then((res) => {
          const list = res.data.data;
          console.log("根据id搜索", list);
          list.createTime = parseTime(list.createTime).substring(0, 10);
          list.updateTime = parseTime(list.updateTime).substring(0, 10);
          this.dataList = [];
          this.$set(this.dataList, 0, list);
        });
      }
      // 根据名称搜索
      if (this.searchForm.categoryName) {
        this.getList();
      }
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
      console.log(row);
      this.updateForm.categoryId = row.categoryId;
      this.updateForm.categoryName = row.categoryName;
      this.updateForm.categoryDesc = row.categoryDesc;
      this.popup.open = true;
      this.popup.type = 2;
    },
    // 删除类别
    handleDelete(row) {
      console.log(row);
      this.$confirm("此操作将永久删除类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delCategory(row.categoryId).then((res) => {
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
    /** 导出按钮操作 */
    handleExport() {
      exportExcel().then(response => {
        console.log(response);
        const contentDisposition = response.headers['content-disposition']
        const filename = contentDisposition.split("filename=")[1]
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', decodeURIComponent(filename))
        document.body.appendChild(link)
        link.click()
        // this.$message.warning(response.data.message)
      }).catch(error => {
        this.$message.error('下载失败')
        console.log(error)
      })
      // axios({
      //   url: '/product/category/export',
      //   method: 'get',
      //   responseType: 'blob', 
      //   headers: { Authorization: "Bearer " + getToken() }
      // }).then(response => {
      //   console.log(response);
      //   const contentDisposition = response.headers['content-disposition']
      //   const filename = contentDisposition.split("filename=")[1]
      //   const url = window.URL.createObjectURL(new Blob([response.data]))
      //   const link = document.createElement('a')
      //   link.href = url
      //   link.setAttribute('download', decodeURIComponent(filename))
      //   document.body.appendChild(link)
      //   link.click()
      //   // this.$message.warning(response.data.message)
      // }).catch(error => {
      //   this.$message.error('下载失败')
      //   console.log(error)
      // })
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "类别导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      console.log(response)
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.message + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    /** 下载模板操作 */
    importTemplate() {
      templateExcel().then(response => {
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
      //   url: '/product/category/template',
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
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
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
</style>
