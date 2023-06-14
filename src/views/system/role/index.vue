<template>
  <div>
    <el-card class="box-card">
      <el-row :gutter="10">
        <!-- 数据筛选表单 -->
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="100px"
        >
          <!-- 数据筛选表单组件 -->
          <el-col :span="8">
            <el-form-item label="角色编码" prop="roleKey">
              <el-input
                v-model="queryParams.roleKey"
                placeholder="请输入角色编码"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 数据筛选操作按钮 -->
          <el-col :span="8">
            <el-form-item>
              <el-button
                v-hasAuthority="['system:role:query']"
                type="primary"
                icon="el-icon-search"
                size="mini"
                @click="handleQuery"
              >搜索
              </el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
                >重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
    <el-card class="box-card">
      <el-row :gutter="10" class="mb8">
        <el-col :span="3" :offset="0.5">
          <el-button
            v-hasAuthority="['system:role:add']"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
            >新增角色
          </el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="roleList">
        <!-- 数据表格列 -->
        <el-table-column label="角色ID" align="center" prop="roleId" />
        <el-table-column label="角色名称" align="center" prop="roleName" />
        <el-table-column label="角色编码" align="center" prop="roleKey" />
        <el-table-column label="排序" align="center" prop="roleSort" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small" type="success"
              >正常</el-tag
            >
            <el-tag
              v-else-if="scope.row.status === '1'"
              size="small"
              type="danger"
              >禁用</el-tag
            >
          </template>
        </el-table-column>
        <!-- 数据行操作按钮 -->
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <!-- <el-button
              v-hasAuthority="['system:role:authMenu']"
              size="small"
              type="text"
              icon="el-icon-key"
              @click="handleMenu(scope.row)"
              >分配菜单</el-button
            > -->
            <el-button
              v-hasAuthority="['system:role:edit']"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改
            </el-button>
            <el-button
              v-hasAuthority="['system:role:authMenu']"
              size="small"
              type="text"
              icon="el-icon-circle-check"
              @click="handleMenu(scope.row)"
              >菜单权限
            </el-button>
            <el-button
              v-hasAuthority="['system:role:remove']"
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>

    <!-- 添加修改role对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <!-- 数据编辑表单组件 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色编码" prop="roleKey">
          <el-input v-model="form.roleKey" placeholder="请输入角色编码" />
        </el-form-item>
        <el-form-item label="排序" prop="roleSort">
          <el-input v-model="form.roleSort" placeholder="请输入排序编号" />
        </el-form-item>
      </el-form>
      <!-- 数据提交操作按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      :title="menuTitle"
      :visible.sync="menuDialogFormVisible"
      width="300px"
    >
      <el-form :model="menuForm">
        <el-form-item label="菜单权限">
          <el-checkbox
            v-model="checkStrictly"
            @change="handleCheckedTreeConnect($event, 'menu')"
            >父子联动</el-checkbox
          >
          <el-tree
            ref="menuTree"
            class="tree-border"
            :data="menuTreeData"
            show-checkbox
            :check-strictly="!checkStrictly"
            node-key="menuId"
            :default-expand-all="true"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthMenu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/** 导入axios Api */
import {
  listRoleByPage,
  getRole,
  addRole,
  updateRole,
  deleteRole,
  authMenu,
} from "@/api/system/role";
import { listMenu, getMenusByRoleId } from "@/api/system/menu";
export default {
  name: "Role",
  data() {
    return {
      // 状态类型
      statusOptions: [
        { value: "0", label: "正常" },
        { value: "1", label: "禁用" },
      ],
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 当前页
      currentPage: 0,
      // 每页数据量
      pageSize: 0,
      // Role表格数据
      roleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 数据查询参数
      queryParams: {
        currentPage: 1,
        pageSize: 5,
        roleKey: null,
        status: null,
      },
      // 数据编辑表单
      form: {},
      // 表单数据校验规则
      rules: {
        roleName: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "角色编码不能为空", trigger: "blur" },
        ],
        roleSort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
        ],
      },
      menuDialogFormVisible: false,
      defaultProps: {
        children: "children",
        id: "menuId",
        label: "menuName",
      },
      // 菜单选项
      menuOptions: [],
      menuForm: {},
      menuTreeData: [],
      checkStrictly: true,
      menuTitle: "",
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询Role数据列表 */
    getList() {
      this.loading = true;
      listRoleByPage(this.queryParams).then((response) => {
        this.roleList = response.data.data.data;
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
        roleId: null,
        roleName: null,
        roleKey: null,
        roleSort: null,
      };
    },

    /** 数据筛选参数重置按钮 */
    resetQueryParams() {
      this.queryParams.currentPage = 1;
      this.queryParams.pageSize = 5;
    },

    /** 数据筛选搜索按钮 */
    handleQuery() {
      this.resetQueryParams();
      this.getList();
      this.$message.success("查询成功");
    },

    /** 数据筛选重置按钮 */
    resetQuery() {
      this.queryParams = {
        currentPage: 1,
        pageSize: 5,
        roleId: null,
        roleKey: null,
        status: null,
      };
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm();
      this.open = true;
      this.title = "添加Role";
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm();
      getRole(row.roleId).then((response) => {
        this.form = response.data.data;
        this.open = true;
        this.title = "修改Role";
      });
    },

    /** 数据提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.roleId === null) {
            addRole(this.form).then((response) => {
              this.$message.success(response.data.message);
              this.open = false;
              this.title = "";
              this.getList();
            });
          } else {
            updateRole(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除名称为"' + row.roleName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteRole(row.roleId);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },

    /** 处理分配菜单 */
    handleMenu(row) {
      this.menuForm.roleId = row.roleId;
      this.menuTitle = "为角色[" + row.roleName + "]分配菜单";
      this.menuDialogFormVisible = true;
      listMenu().then((response) => {
        this.menuTreeData = response.data.data;
      });
      getMenusByRoleId(this.menuForm.roleId).then((response) => {
        var menus = response.data.data;
        const menuIds = menus
          .map((menu) => menu && menu.menuId)
          .filter((menuId) => menuId !== undefined);
        this.$refs.menuTree.setCheckedKeys(menuIds);
      });
    },

    /** 提交分配菜单表单 */
    submitAuthMenu() {
      this.menuForm.menuIds = this.$refs.menuTree.getCheckedKeys();
      authMenu(this.menuForm).then((response) => {
        this.$message.success(response.data.message);
        this.menuDialogFormVisible = false;
        this.resetMenuForm();
      });
    },

    resetMenuForm() {
      this.menuForm = {
        roleId: null,
        menuIds: [],
      };
    },

    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type == "menu") {
        this.checkStrictly = !!value;
      }
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