<!-- eslint-disable vue/html-closing-bracket-newline -->
<template>
  <div>
    <!-- 搜索框 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>款式查询</span>
      </div>
      <el-form ref="searchForm" :inline="true" :model="searchForm">
        <el-row :gutter="2" type="flex" justify="space-around" align="center">
          <el-col :span="6">
            <el-form-item label="名称:" prop="productName">
              <el-input
                v-model="searchForm.productName"
                placeholder="请输入款式名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="类别:" prop="categoryId">
              <el-select v-model="searchForm.categoryId" placeholder="请选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.categoryId"
                  :label="item.categoryName"
                  :value="item.categoryId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button
                v-hasAuthority="['product:spuInfo:query']"
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
                v-hasAuthority="['product:spuInfo:add']"
                type="success"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="handleAdd"
              >新建款式</el-button
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
          label="ID"
          align="center"
          prop="productId"
          sortable
        />
        <el-table-column
          label="名称"
          align="center"
          prop="ellipsis"
          sortable
        >
          <template slot-scope="scope">
            <el-popover placement="top-start" title="名称：" width="200" trigger="hover" :content="scope.row.productName">
              <p slot="reference" class="ellipsis">{{ scope.row.productName }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="类别" align="center" prop="categoryName" />
        <el-table-column label="描述" align="center" prop="productDesc">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="描述：" width="200" trigger="hover" :content="scope.row.productDesc">
              <p slot="reference" class="ellipsis">{{ scope.row.productDesc }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建者" align="center" prop="createBy" />
        <el-table-column label="修改者" align="center" prop="updateBy" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-hasAuthority="['product:spuInfo:edit']"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改</el-button
            >
            <el-button
              v-hasAuthority="['product:spuInfo:remove']"
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
    <el-dialog
      :visible.sync="popup.open"
      width="500px"
      append-to-body
      @close="cancel"
    >
      <el-form ref="updateForm" :model="updateForm" label-width="120px">
        <!-- 数据编辑表单组件 -->
        <el-form-item label="商品名称" prop="productName">
          <el-input
            v-model="updateForm.productName"
            placeholder="请输入商品名称"
          />
        </el-form-item>
        <el-form-item label="商品描述" prop="productDesc">
          <el-input
            v-model="updateForm.productDesc"
            placeholder="请输入商品描述"
          />
        </el-form-item>
        <el-form-item label="商品类别" prop="category">
          <el-select v-model="updateForm.categoryId" placeholder="请选择">
            <el-option
              v-for="item in categoryList"
              :key="item.categoryId"
              :label="item.categoryName"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" prop="attrKey">
          <el-input v-model="updateForm.attrKey" clearable="true" style="width: 320px;" />
          <el-button type="primary" @click="appendAttr">添加</el-button>
          <!-- <el-select
            v-model="attrKey"
            multiple
            placeholder="请选择商品属性"
          >
            <el-option label="颜色" :value="1" />
            <el-option label="尺寸" :value="2" />
          </el-select> -->
        </el-form-item>
        <el-form-item>
          <el-row :gutter="24">
            <el-col
              v-for="(attr, index) in updateForm.attrKeys"
              :key="index"
              :span="5"
            >
              <el-tag closable type="info" @close="closeAttr(index)">
                {{ attr }}
              </el-tag> 
            </el-col>
          </el-row>
          
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
  listSpuByPage,
  addProduct,
  updateProduct,
  delProduct,
} from "@/api/product/spuInfo";
import { listByPage } from "@/api/product/category";
import { getAttrKeyBySpuId } from "@/api/product/attrInfo";
export default {
  data() {
    return {
      loading: false,
      // 搜索表单
      searchForm: {
        categoryId: "",
        productName: "",
      },
      // 表格数据
      dataList: [],
      // 类别数据
      categoryList: [],
      // 弹出框属性
      popup: {
        open: false,
        type: "", // 1为添加，2为修改
      },
      // 弹出框表单
      updateForm: {
        productId:'',
        productName: "",
        productDesc: "",
        categoryId: "",
        attrKeys: [],
        attrKey: ''
      },
      attrKey: "",
      attrMap: {
        颜色: 1,
        尺寸: 2,
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
    // 获取商品列表参数
    listSpuByPageParams() {
      return {
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        productName: this.searchForm.productName,
        productDesc: "",
        categoryId: this.searchForm.categoryId,
      };
    },
    // 获取类别列表参数
    categoryParams() {
      return {
        currentPage: 1,
        pageSize: 100,
        categoryName: "",
      };
    },
    // 获取属性值参数
    attrKeyParams() {
      return {
        currentPage: 1,
        pageSize: 10,
        attrName: "",
      };
    },
  },
  created() {
    this.getList();
    this.getCategoryList();
    this.getAttrKey(1);
  },
  methods: {
    // 查询类别列表
    getCategoryList() {
      listByPage(this.categoryParams).then((res) => {
        // console.log("类别数据", res);
        this.categoryList = res.data.data.data;
      });
    },
    // 查询商品列表
    getList() {
      this.loading = true;
      listSpuByPage(this.listSpuByPageParams).then((res) => {
        const list = res.data.data;
        this.loading = false;
        this.dataList = list.data;
        console.log("款式列表", this.dataList);
        this.page.currentPage = list.currentPage;
        this.page.totalData = list.totalData;
      });
    },
    // 获取属性值
    getAttrKey(id) {
      getAttrKeyBySpuId(id).then((res) => {
        // console.log('获取属性值',res)
        this.attrList = res.data.data;
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
      if (!this.searchForm.categoryId && !this.searchForm.productName) {
        this.$message({
          message: "请输入搜索条件",
          type: "warning",
        });
        return;
      }
      this.getList();
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
      console.log(row)
      this.updateForm.productId=row.productId
      this.updateForm.categoryId = row.categoryId;
      this.updateForm.productName = row.productName;
      this.updateForm.productDesc = row.productDesc;
      this.updateForm.attrKeys = (row.attrKeys || []).map(
        (item) => item.attrName
      );
      this.popup.open = true;
      this.popup.type = 2;
    },
    // 删除类别
    handleDelete(row) {
      this.$confirm("此操作将永久删除类别, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delProduct(row.productId).then((res) => {
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
      if (
        !this.updateForm.productName ||
        !this.updateForm.categoryId ||
        !this.updateForm.attrKeys
      ) {
        this.$message.error("请输入信息");
        return;
      }
      // 添加属性值
      for(let i=0;i<this.attrKey.length;i++){
        let attrName=this.findKeyByValue(this.attrMap,this.attrKey[i])
        this.updateForm.attrKeys[i]=attrName
      }
      console.log(this.updateForm)
      // 添加
      if (this.popup.type == 1) {
        addProduct(this.updateForm)
          .then((res) => {
            console.log(this.updateForm);
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
        updateProduct(this.updateForm)
          .then((res) => {
            console.log(this.updateForm);
            console.log("修改", res);
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
            // 清空表单
            this.updateForm = this.$options.data().updateForm;
          });
      }
    },
    // 添加修改弹出框-取消按钮
    cancel() {
      this.updateForm = this.$options.data().updateForm;
      this.popup.open = false;
    },
    // 根据对象的value去找key
    findKeyByValue(obj, value) {
      for (const key in obj) {
        if (obj[key] == value) {
          return key;
        }
      }
      return null; // 没有找到匹配的键
    },
    appendAttr() {
      const attrKey = this.updateForm.attrKey
      if(attrKey == '' || attrKey == undefined) {
        return;
      }
      this.updateForm.attrKeys.push(attrKey)
    },
    closeAttr(index) {
      this.updateForm.attrKeys.splice(index, 1)
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

.ellipsis{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  -webkit-line-clamp: 1;
}
</style>
