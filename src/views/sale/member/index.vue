<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付查询</span>
      </div>
      <el-form
        ref="queryForm"
        :model="queryParams"
        :inline="true"
        label-width="100px"
      >
        <el-row :gutter="2" type="flex" justify="space-between" align="center">
          <!-- 数据筛选表单 -->
          <el-col :span="6.5">
            <!-- 数据筛选表单组件 -->
            <el-form-item label="ID" prop="memberId" label-width="auto">
              <el-input
                v-model="queryParams.memberId"
                placeholder="请输入会员ID"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6.5">
            <el-form-item label="会员名" prop="name" label-width="auto">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入会员名"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6.5">
            <el-form-item label="手机" prop="phone" label-width="auto">
              <el-input
                v-model="queryParams.phone"
                placeholder="请输入手机号码"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <!-- 数据筛选操作按钮 -->
          <el-col :span="6.5">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
              >搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-row :gutter="10" class="mb8">
        <el-col :span="3" :offset="0.5">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增会员
          </el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="userList">
        <!-- 数据表格列 -->
        <el-table-column label="会员ID" align="center" prop="memberId" />
        <el-table-column label="会员名称" align="center" prop="name" />
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="scope">
            <span v-if="scope.row.sex == '0'">男</span>
            <span v-else-if="scope.row.sex == '1'">女</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" align="center" prop="phone" />
        <el-table-column label="会员积分" align="center" prop="memberPoint" />
        <el-table-column label="会员等级" align="center" prop="memberLevel">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.memberLevel == '1'"
              size="small"
              type="success"
            >VIP1</el-tag>
            <el-tag v-else-if="scope.row.status == '2'" size="small">VIP2</el-tag>
            <el-tag v-else size="small" type="danger"> VIP3 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '0'" size="small" type="success">正常</el-tag>
            <el-tag
              v-else-if="scope.row.status == '1'"
              size="small"
              type="danger"
            >禁用</el-tag>
          </template>
        </el-table-column>
        <!-- 数据行操作按钮 -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 数据分页加载 -->
    <el-pagination
      style="float: right"
      :current-page="currentPage"
      :page-sizes="[5, 10, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :page-count="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      @pagination="getList"
    />
    <!-- 添加修改user对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- 数据编辑表单组件 -->
        <el-form-item label="会员名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入会员名称" />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio label="0">正常</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
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
/** 导入axios Api */
import {
  listMemberByPage,
  listMemberById,
  addMember,
  updateMember,
  delMember,
} from "@/api/member/member";
export default {
  name: "Member",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总页数
      total: 0,
      // 当前页
      currentPage: 0,
      // 每页数据量
      pageSize: 0,
      // User表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据查询参数
      queryParams: {
        currentPage: 1,
        pageSize: 5,
        memberId: null,
        name: null,
        phone: null,
        memberLevel: null,
      },
      // 数据编辑表单
      form: {
        name: "",
        phone: "",
        sex: "",
        status: "",
      },
      // 表单数据校验规则
      rules: {
        name: [{ required: true, message: "会员名不能为空", trigger: "blur" }],
        phone: [
          {
            required: true,
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "radio" }],
        status: [{ required: true, message: "请选择状态", trigger: "radio" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询数据列表 */
    getList() {
      this.loading = true;
      listMemberByPage(this.queryParams).then((response) => {
        this.userList = response.data.data.data;
        this.total = response.data.data.totalPage;
        this.currentPage = this.queryParams.currentPage;
        this.pageSize = this.queryParams.pageSize;
        this.loading = false;
      });
    },
    /** 处理分页 */
    handleSizeChange(val) {
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.currentPage = val;
      this.getList();
    },

    /** 数据编辑对话框取消按钮 */
    cancel() {
      this.open = false;
      this.resetForm();
    },

    /** 数据编辑表单清空 */
    resetForm() {
      this.form = {
        memberId: null,
        name: null,
        sex: "0",
        status: "0",
      };
    },

    /** 数据筛选参数重置按钮 */
    resetQueryParams() {
      this.queryParams.currentPage = 1;
      this.queryParams.pageSize = 5;
    },

    /** 数据筛选搜索按钮 */
    handleQuery() {
      this.resetQueryParams;
      this.getList();
      this.$message.success("查询成功");
    },

    /** 数据筛选重置按钮 */
    resetQuery() {
      this.queryParams = {
        currentPage: 1,
        pageSize: 5,
        name: null,
      };
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm();
      this.open = true;
      this.title = "添加会员";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm();
      listMemberById(row.memberId).then((response) => {
        response.data.data.sex = response.data.data.sex.toString()
        response.data.data.status = response.data.data.status.toString()
        this.form = response.data.data;
        this.open = true;
        this.title = "修改会员";
      });
    },

    /** 数据提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.memberId === null) {
            addMember(this.form).then((response) => {
              this.$message.success(response.data.message);
              this.open = false;
              this.title = "";
              this.getList();
            });
          } else {
            updateMember(this.form).then((response) => {
              this.$message.success(response.data.message);
              this.open = false;
              this.title = "";
              this.getList();
            });
          }
        }
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.name + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return delMember(row.memberId);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="less" scoped>
.box-card {
  margin: 1% 0;
  width: 100%;
}
</style>
