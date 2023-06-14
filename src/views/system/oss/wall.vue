<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="24" :xs="24">
        <!-- 数据筛选表单 -->
        <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
          <!-- 数据筛选表单组件 -->
          <el-form-item label="图片标题" prop="title">
            <el-input v-model="queryParams.title" placehold clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <el-form-item label="文件名" prop="fileName">
            <el-input v-model="queryParams.fileName" placehold clearable size="small" @keyup.enter.native="handleQuery" />
          </el-form-item>
          <!-- 数据筛选操作按钮 -->
          <el-form-item>
            <el-button icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" icon="el-icon-plus" @click="handleAdd">上传图片</el-button>

          </el-form-item>
          <el-form-item label="调整列数">
            <template>
              <el-input-number v-model="col" :min="3" :max="8" @change="handleChange" />
            </template>

          </el-form-item>
        </el-form>
        <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
          <el-upload 
            :action="uploadApi" 
            :headers="headers"
            list-type="picture-card" 
            :auto-upload="true"
            :on-success="handleSuccess"
            :on-error="handleError"
            :file-list="imageList" 
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
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!-- <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleUploadFiles">上传到OSS</el-button>
          </div> -->
        </el-dialog>
        <div class="waterfall">
          <image-water-fall :list="ossList" :col="col" @changeList="getList" />
        </div>

        <!-- 数据分页加载 -->
        <el-pagination 
          style="float: right"
          :current-page="page.currentPage"
          :page-sizes="[5, 10, 20, 50,100]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next"
          :total="page.totalData"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        /> 
      </el-col>
    </el-row>
    <!-- 添加修改oss对话框 -->
  </div>
</template>

<script>
/** 导入axios Api */
import { listOssByPage, addOss} from '@/api/system/oss'
import ImageWaterFall from '@/components/ImageWaterFall'
import { getToken } from "@/utils/auth";
export default {
  name: 'Oss',
  components: { ImageWaterFall },
  data() {
    return {
      // 图片上传headers
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      // 遮罩层
      loading: false,
      // 分页数据
      page: {
        currentPage: 1,
        totalPage: 0,
        pageSize: 50,
        totalData: 0,
      },
      // Oss表格数据
      ossList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 数据查询参数
      queryParams: {
        title: null,
        fileName: null
      },
      // 上传图片数据
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      uploadApi: process.env.VUE_APP_BASE_API + '/system/oss/upload', 
      // 图片地址
      imageList: [],
      // 展示图片数据
      col: 8,

    //   imageList: [
    //     {
    //       fileUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    //       title: '樱花小鸟',
    //       fileName: '4a731a90594a4af544c0c25941171jpeg.jpeg'
    //     },
    //     {
    //       fileUrl: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
    //       title: '白雪小狗',
    //       fileName: 'bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'
    //     },
    //     {
    //       fileUrl: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
    //       title: '青草骏马',
    //       fileName: '19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
    //     }
    //   ]
    }
  },
    computed: {
    // 分页查询参数
    listByPageParams() {
      return {
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        title: this.queryParams.title,
        fileName: this.queryParams.fileName
      };
    },
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询Oss数据列表 */
    getList() {
      this.loading = true
      this.ossList=[]
      listOssByPage(this.listByPageParams).then((response) => {
        const resultList= response.data.data.data
        for( let i=0;i<resultList.length;i++){
          const imageUrl = `http://43.139.27.107:1532/${resultList[i].bucket}/${resultList[i].fileName}`;
          const imageFileList={
              name:resultList[i].fileOriginalName,
              url:imageUrl,
              ossId:resultList[i].ossId
          }
          this.ossList.push(imageFileList)
        }
        this.page.currentPage = this.listByPageParams.currentPage;
        this.page.pageSize= this.listByPageParams.pageSize
        this.page.totalData = response.data.data.totalData;
        this.loading = false
      })
    },
    // 处理分页
    handleSizeChange(val){
      this.page.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val){
      this.page.currentPage = val;
      this.getList();
    },

    /** 数据编辑对话框取消按钮 */
    cancel() {
      this.open = false
      this.resetForm()
    },
    /** 处理添加图片按钮 */
    handleAdd() {
      this.open = true
      this.title = '上传图片'
    },
    /** 手动上传多个图片 */
    handleUploadFiles(){
      const image= !this.imageList?'':this.imageList.join()
      console.log(this.imageList)
      // addOss(this.imageList).then(response => {
      //     if (response.data.code == 200) {
      //         this.$message({
      //         type: "success",
      //         message: "上传成功!",
      //     });
      //     } else {
      //     this.$message.error("上传失败");
      //     }
      //     this.getList()
      // })
      // this.imageList=[]
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
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /** 修改每页列数 */
    handleChange(value) {
      this.col = value
    },

    // 自动上传成功交互
    handleSuccess(response, file, fileList) {
      console.log(response)
      const imageUrl = `http://43.139.27.107:1532/${response.data.bucketName}/${response.data.fileName}`
      console.log(imageUrl)
      const imageFileList={
        name:imageUrl,
        url:imageUrl
      }
      this.imageList.push(imageFileList);
      this.$message.success(response.message)
      this.getList()
    },
    // 图片上传失败
    handleError(error, file, fileList) {
      console.log(error)
      this.$message.error(error);
    },

    /** 数据筛选搜索按钮 */
    handleQuery() {
      this.resetQueryParams()
      this.getList()
      this.$message.success('查询成功')
    },

    /** 数据筛选重置按钮 */
    resetQuery() {
      this.$refs.queryForm.resetFields()
      this.getList()
      console.log("重置后数据",this.ossList)
    },
    /** 重置分页 */
    resetQueryParams() {
      this.page.currentPage = 1
      this.page.pageSize = 50
    },
  }
}
</script>
<style lang="less" scoped>
  .app-container{
    padding:10px;
  }
</style>