<template>
  <div>
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view />
        </keep-alive>
      </transition>
    </section>
    <el-dialog title="个人信息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="userInfoForm" :model="userInfoForm" label-width="80px" class="form" :rules="rules">
        <div class="avatar">
          <img :src="userInfoForm.avatar+'?imageView2/1/w/80/h/80'" class="user-avatar" @click="clickAvatar">
        </div> 
        <el-form-item label="用户名称:" prop="userName" class="item">
          <el-col :span="19">
            <el-input v-model="userInfoForm.userName" />
          </el-col>
        </el-form-item>
        <el-form-item label="用户权限:" prop="roleKey" class="item">
          <el-col :span="19">
            <el-input v-model="userInfoForm.roleKey" :disabled="true" />
          </el-col>
        </el-form-item>
        <el-form-item label="密码:" prop="password" class="item">
          <el-col :span="19">
            <el-input v-model="userInfoForm.password" type="password" :disabled="true" />
          </el-col>
          <el-col :span="4" style="margin-left: 3%;">
            <el-button type="primary" icon="el-icon-edit" @click="updatePassWord" />
          </el-col>
        </el-form-item>
        <el-form-item label="手机号:" prop="phone" class="item">
          <el-col :span="19">
            <el-input v-model="userInfoForm.phone" />
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitUserInfo">修改个人信息</el-button>
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码" :visible.sync="passWordOpen" width="30%" :before-close="handleUpdateClose">
      <el-form ref="updateForm" :model="updateForm" :rules="updatePasswordRules" label-width="80px" class="form">
        <el-form-item label="旧密码:" prop="oldPassword" class="item">
          <el-input v-model="updateForm.oldPassword" type="password" placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码:" prop="newPassword" class="item">
          <el-input v-model="updateForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">修改密码</el-button>
        <el-button @click="passWordOpen=false">取 消</el-button>
      </span>
    </el-dialog>
    
    <el-dialog title="修改头像" :visible.sync="avatarOpen" width="40%" :before-close="handleUpdateClose">
      <el-upload 
        style="display: flex; justify-content: center;"
        :action="uploadApi" 
        :headers="headers"
        list-type="picture-card" 
        :auto-upload="true"
        :on-success="handleSuccess"
        :on-error="handleError"
        :file-list="imageList" 
        :limit="num"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in" />
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </el-upload>
      <el-dialog :visible.sync="preDialogVisible">
        <img width="100%" :src="preDialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeAvatar">修改头像</el-button>
        <el-button @click="avatarOpen=false">取 消</el-button>
      </span>
    </el-dialog> 
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updatePassword, } from '@/api/system/user'
import { getToken } from "@/utils/auth";
export default {
  name: 'AppMain',
  data(){
    return{
      userInfoForm: {
        avater:null,
        userName:null,
        phone: null,
        password:null
      },
      updateForm: {
        oldPassword:null,
        newPassword:null
      },
      passWordOpen:false,
      avatarOpen: false,
      // 表单数据校验规则
      rules:{
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
      updatePasswordRules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "用户密码长度必须介于 6 和 20 之间", trigger: "blur",},
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "用户密码长度必须介于 6 和 20 之间", trigger: "blur",},
        ]
      },
      imageList: [],
      uploadApi: process.env.VUE_APP_BASE_API + '/system/oss/upload',
      // 图片上传headers
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      // 上传图片数据
      preDialogImageUrl: '',
      preDialogVisible: false,
      disabled: false,
      num: 1,
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    dialogVisible() {
      return this.$store.state.app.dialogVisible
    },
    ...mapGetters([
      'roles',
    ])
  },
  created(){
    this.userInfoForm.avatar=this.$store.state.user.avatar
    this.userInfoForm.userName=this.$store.state.user.name
    this.userInfoForm.phone=this.$store.state.user.phone
    this.userInfoForm.roleKey=this.roles[0].roleKey
    this.userInfoForm.password=this.$store.state.user.password
  },
  methods:{
    // 关闭弹窗
    closeDialog() {
      this.$store.dispatch('app/closeUserInfo')
    },
    handleClose(done) {
      this.$store.dispatch('app/closeUserInfo')
    },
    handleUpdateClose(){
      this.passWordOpen=false
      this.avatarOpen=false
    },
    // 退出登录
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },

    //  修改密码
    updatePassWord(){
      this.updateForm= {
        oldPassword:null,
        newPassword:null
      }
      this.passWordOpen=true
    },
    submit(){
      updatePassword(this.updateForm).then(res => {
        if(res.data.code==200){
          this.$confirm("修改完成，请重新登录", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false, // 是否显示取消按钮
            showClose: false, // 是否显示关闭按钮
            type: "success",
          }).then(() => {
            this.logout()
            this.passWordOpen=false
            this.closeDialog()
          })
        }else this.$message.warning(res.data.message)
      })
    },

    clickAvatar(){
      this.avatarOpen=true
    },

    /** 上传图片——删除已添加图片 */
    handleRemove(file) {
      const index = this.imageList.findIndex((item) => {
        return item === file.name;
      });
      this.imageList.splice(index, 1);
    },
    /** 上传图片——查看图片 */
    handlePictureCardPreview(file) {
      this.preDialogImageUrl = file.url
      console.log(file)
      this.preDialogVisible = true
    },

    // 自动上传成功交互
    handleSuccess(response, file, fileList) {
      console.log(response)
      const { bucketName, fileName } = response.data;
      const imageUrl = `http://43.139.27.107:1532/${bucketName}/${fileName}`;
      const imageFileList={
        name:fileName,
        url:imageUrl
      }
      this.imageList.push(imageFileList);
      console.log(this.imageList);
      this.$message.success(response.message)
    },
    // 图片上传失败
    handleError(error, file, fileList) {
        console.log(error)
        this.$message.error(error);
    },
    // 修改头像
    changeAvatar(){
      this.userInfoForm.avatar=this.imageList[0].url
      this.imageList=[]
      this.avatarOpen=false
    },
    // 修改个人信息
    submitUserInfo(){
      if(this.userInfoForm.avatar!=this.$store.state.user.avatar ||
        this.userInfoForm.userName!=this.$store.state.user.name  ||
        this.userInfoForm.phone!=this.$store.state.user.phone) {
          const userInfo = {
            name: this.userInfoForm.userName,
            phone: this.userInfoForm.phone,
            avatar: this.userInfoForm.avatar
          }
          console.log(this.userInfoForm.avatar)
          this.$store.dispatch('user/updateUserInfo',userInfo)
          this.$store.dispatch('app/closeUserInfo')
          this.$message.success("修改成功")
      }else {
        this.$message.warning("请先对信息进行更改")
      }
    },
  }
}
</script>

<style lang="less" scoped>
.app-main {
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}

.form {
  .avatar{
    display:flex;
    justify-content: center;
    align-items: center;
    margin:10px 0 40px 0;
    .user-avatar {
      cursor: pointer;
      width: 80px;
      height: 80px;
      border-radius: 50%;
  }
  }
}

.dialog-footer{
  display: flex;
  justify-content: center;
}

</style>

<style lang="scss">
.hasTagsView {
  .app-main {
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
