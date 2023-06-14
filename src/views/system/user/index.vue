<template>
  <div>
    <el-card class="box-card">
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
            <el-form-item label="ID" prop="userId" label-width="auto">
              <el-input
                v-model="queryParams.userId"
                placeholder="请输入用户ID"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6.5">
            <el-form-item label="用户名" prop="userName" label-width="auto">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6.5">
            <el-form-item prop="status" label="请选择" label-width="auto">
              <el-select
                v-model="queryParams.status"
                size="small"
                placeholder="请选择状态"
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
          <el-col :span="5">
            <!-- 数据筛选操作按钮 -->
            <el-form-item>
              <el-button
                v-hasAuthority="['system:user:query']"
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
        <el-col :span="1.5" :offset="0.5">
          <el-button
            v-hasAuthority="['system:user:add']"
            type="primary"
            icon="el-icon-plus"
            size="small"
            @click="handleAdd"
          >新增角色
          </el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-hasAuthority="['system:user:import']"
            type="info"
            icon="el-icon-upload2"
            size="small"
            @click="handleImport"
          >导入</el-button>
        </el-col>

        <el-col :span="1.5">
          <el-button
            v-hasAuthority="['system:user:export']"
            type="warning"
            icon="el-icon-download"
            size="small"
            @click="handleExport"
          >导出</el-button>
        </el-col>
          
      </el-row>
      <!-- 数据表格 -->
      <el-table v-loading="loading" :data="userList">
        <!-- 数据表格列 -->
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户名称" align="center" prop="userName" />
        <el-table-column label="用户昵称" align="center" prop="nickName" />
        <el-table-column label="手机号码" align="center" prop="phone" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === '0'" size="small" type="success">正常</el-tag>
            <el-tag
              v-else-if="scope.row.status === '1'"
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
              v-hasAuthority="['system:user:authRole']"
              size="small"
              type="text"
              icon="el-icon-key"
              @click="handleRole(scope.row)"
            >分配角色</el-button>
            <el-button
              v-hasAuthority="['system:user:edit']"
              size="small"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
            >修改
            </el-button>
            <el-button
              v-hasAuthority="['system:user:remove']"
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
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item
          v-if="form.userId == undefined"
          label="用户密码"
          prop="password"
        >
          <el-input
            v-model="form.password"
            placeholder="请输入用户密码"
            type="password"
            maxlength="20"
            show-password
          />
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.value"
              :label="dict.value"
            >{{ dict.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="isRole" label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" multiple placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
              :disabled="item.status == 1"
            />
          </el-select>
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
      :title="roleTitle"
      :visible.sync="roleDialogFormVisible"
      width="300px"
    >
      <el-form :model="roleForm">
        <el-tree
          ref="roleTree"
          :data="roleTreeData"
          show-checkbox
          :check-strictly="checkStrictly"
          node-key="roleId"
          :default-expand-all="true"
          :props="defaultProps"
        />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAuthRole">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
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
/** 导入axios Api */
import {
  listUserByPage,
  getUser,
  addUser,
  updateUser,
  deleteUser,
  authRole,
  exportExcel,
  templateExcel
} from "@/api/system/user";
import { listAllRole, getRolesByUserId } from "@/api/system/role";
import { getToken } from "@/utils/auth";
import axios from 'axios'
export default {
  name: "User",
  data() {
    return {
      // 状态类型
      statusOptions: [
        {
          value: "0",
          label: "正常",
        },
        {
          value: "1",
          label: "禁用",
        },
      ],
      // User类型
      typeOptions: undefined,
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
        userId: null,
        userName: null,
        status: null,
      },
      // 数据编辑表单
      form: {
        userName: "",
        password: "",
        nickName: "",
        phone: "",
        status: "",
        roles: [],
      },
      // 表单数据校验规则
      rules: {
        userName: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      roleDialogFormVisible: false,
      defaultProps: {
        label: "roleKey",
      },
      // 角色选项
      roleOptions: [],
      roleForm: {},
      roleTreeData: [],
      checkStrictly: true,
      roleTitle: "",
      isRole: true,
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
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
  created() {
    this.getList();
  },
  methods: {
    /** 查询User数据列表 */
    getList() {
      this.loading = true;
      listUserByPage(this.queryParams).then((response) => {
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
        userId: null,
        userName: null,
        nickName: null,
        status: "0",
      };
    },

    resetRoleForm() {
      this.roleForm = {
        userId: null,
        roleIds: [],
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
        username: null,
        status: null,
      };
      this.getList();
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm();
      this.open = true;
      this.title = "添加User";
      listAllRole().then((response) => {
        this.roleOptions = response.data.data;
      });
      this.isRole = true;
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm();
      getUser(row.userId).then((response) => {
        this.form = response.data.data;
        this.open = true;
        this.title = "修改User";
        this.isRole = false;
      });
    },

    /** 数据提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId === null) {
            addUser(this.form).then((response) => {
              this.$message.success(response.data.message);
              this.open = false;
              this.title = "";
              this.getList();
            });
          } else {
            updateUser(this.form).then((response) => {
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
        '是否确认删除名称为"' + row.userName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return deleteUser(row.userId);
        })
        .then(() => {
          this.getList();
          this.$message.success("删除成功");
        })
        .catch(() => {});
    },

    /** 处理分配角色 */
    handleRole(row) {
      this.roleForm.userId = row.userId;
      this.roleTitle = "为用户[" + row.nickName + "]分配角色";
      this.roleDialogFormVisible = true;
      listAllRole().then((response) => {
        this.roleTreeData = response.data.data;
      });
      getRolesByUserId(this.roleForm.userId).then((response) => {
        var roles = response.data.data;
        const roleIds = roles
          .map((role) => role && role.roleId)
          .filter((roleId) => roleId !== undefined);
        this.$refs.roleTree.setCheckedKeys(roleIds);
      });
    },
    /** 提交分配角色表单 */
    submitAuthRole() {
      this.roleForm.roleIds = this.$refs.roleTree.getCheckedKeys();
      authRole(this.roleForm).then((response) => {
        this.$message.success(response.data.message);
        this.roleDialogFormVisible = false;
        this.resetRoleForm();
      });
    },
    /** 导出按钮操作 */
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
      //   url: '/system/user/export',
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
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
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
      //   url: '/system/user/template',
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
<style lang="less" scoped>
.box-card {
  margin: 1% 0;
  width: 100%;
}
</style>
