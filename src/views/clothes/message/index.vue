<!-- eslint-disable vue/html-closing-bracket-newline -->
<!-- eslint-disable vue/html-self-closing -->
<template>
  <div>
    <!-- 步骤条 -->
    <el-card>
      <el-steps :active="active" finish-status="success" simple>
        <el-step title="类别信息"></el-step>
        <el-step title="商品信息"></el-step>
        <el-step title="补充信息"></el-step>
      </el-steps>
    </el-card>

    <!-- 类别信息 -->
    <el-card v-if="active == 0" class="step1">
      <el-form
        ref="categoryForm"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="80px"
      >
        <el-form-item label="商品款式" prop="spuId">
          <el-select
            v-model="categoryForm.spuId"
            placeholder="请选择款式"
            filterable
            @change="selectSpu"
          >
            <el-option
              v-for="item in spuList"
              :key="item.productId"
              :label="item.productName"
              :value="item.productId"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品类型" prop="radio">
          <el-radio-group v-model="categoryForm.radio">
            <el-radio :label="1">男装</el-radio>
            <el-radio :label="2">女装</el-radio>
            <el-radio :label="3">童装</el-radio>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item label="商品类别" prop="categoryName">
          <el-select
            v-model="categoryForm.categoryName"
            placeholder="请选择类别"
            disabled
          >
            <el-option
              v-for="item in category"
              :key="item.id"
              :label="item.categoryName"
              :value="item.categoryName"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品尺寸" prop="size">
          <el-select v-model="categoryForm.size" placeholder="请选择尺寸">
            <el-option
              v-for="item in sizeOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品颜色" prop="color">
          <el-select v-model="categoryForm.color" placeholder="请选择颜色">
            <el-option
              v-for="item in colorOption"
              :key="item.id"
              :label="item.name"
              :value="item.name"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item 
          v-for="(attr, index) in categoryForm.attrKeys"
          :key="index"
          :label="attr.name" 
          :prop="attr.name">
          <el-input v-model="attr.value" />
        </el-form-item>
        <!-- 底部按钮 -->
        <el-form-item>
          <el-button type="primary" @click="next('categoryForm')"
          >下一步</el-button
          >
          <!-- <el-button @click="resetForm('productForm')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 类别信息 -->
    <el-card v-else-if="active == 1" class="step2">
      <el-form
        ref="productForm"
        :model="productForm"
        :rules="productRules"
        label-width="80px"
      >
        <!-- 数字类型的验证需要在v-model处加上.number -->
        <el-form-item label="商品价格" prop="price">
          <el-input v-model.number="productForm.price" size="small" />
        </el-form-item>
        <el-form-item label="市场价格" prop="marketPrice">
          <el-input v-model.number="productForm.marketPrice" size="small" />
        </el-form-item>
        <el-form-item label="商品数量" prop="num">
          <el-input-number
            v-model="productForm.num"
            size="small"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="商品状态" prop="status">
          <el-select v-model="productForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in status"
              :key="item.id"
              :label="item.statusName"
              :value="item.id"
              @keyup.enter.native="handleQuery"
            />
          </el-select>
        </el-form-item>
        <!-- 底部按钮 -->
        <el-form-item>
          <el-button type="primary" @click="before">上一步</el-button>
          <el-button type="primary" @click="next('productForm')"
          >下一步</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 补充信息 -->
    <el-card v-else class="step3">
      <el-form ref="otherForm" :model="otherForm" label-width="80px">
        <!-- 商品说明 -->
        <el-form-item label="商品说明">
          <el-input
            v-model="otherForm.desc"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
          />
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="商品图片">
          <el-upload
            action="http://43.139.27.107:1534/system/oss/upload"
            list-type="picture-card"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleSuccessUpload"
            :on-error="handleErrorUpload"
            :before-upload="beforeUpload"
            :file-list="imageFileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <!-- 底部按钮 -->
        <el-form-item class="step3-button">
          <el-button type="primary" @click="before"
          >上一步</el-button>
          <el-button v-hasAuthority="['product:skuInfo:add']" type="primary" @click="onsubmit('otherForm')"
          >完成</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { addProduct,updateProduct } from "@/api/product/SkuInfo";
import { listSpuByPage, listSpuById } from "@/api/product/spuInfo";
import { getToken } from "@/utils/auth";
import { getAttrKeyBySpuId } from "@/api/product/attrInfo";
export default {
  data() {
    return {
      // 图片上传headers
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      // 步骤条
      active: 0,
      // 类型 (0为新增，1为修改)
      type:0,
      /*                  步骤一                       */
      // 商品分类表单数据
      categoryForm: {
        productName: "",
        spuId: "",
        // radio: "",
        categoryName: "",
        // size: "",
        // color: "",
        skuId:'',
        attrKeys: []
      },
      categoryRules: {
        /*   radio: [
          {
            required: true,
            message: "请至少选择一个商品类型",
            trigger: "change",
          },
        ], */
        categoryName: [
          { required: true, message: "请选择商品类别", trigger: "change" },
        ],
        size: [
          { required: true, message: "请选择商品尺寸", trigger: "change" },
        ],
        color: [
          { required: true, message: "请选择商品颜色", trigger: "change" },
        ],
        spuId: [
          { required: true, message: "请选择商品款式", trigger: "change" },
        ],
      },
      // 类型单选框
      // radio: "",
      // 商品款式
      spuList: [],
      // 商品类别
      category: [],
      // 属性列表
      attrList: [],
      // 尺寸选择框
      sizeOption: [
        {
          id: 1,
          name: "S",
        },
        {
          id: 2,
          name: "M",
        },
        {
          id: 3,
          name: "L",
        },
        {
          id: 4,
          name: "XL",
        },
        {
          id: 5,
          name: "XXL",
        },
      ],
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
      /*                  步骤二                       */
      // 基础数据
      productForm: {
        price: "",
        num: 1,
        marketPrice: "",
        status: "",
      },
      // 验证规则
      productRules: {
        price: [
          { required: true, message: "商品价格不能为空" },
          { type: "number", message: "商品价格为数字值" },
        ],
        marketPrice: [
          { required: true, message: "市场价格不能为空" },
          { type: "number", message: "市场价格为数字值" },
        ],
        num: [{ required: true }],
        status: [
          { required: true, message: "请选择上下架状态", trigger: "change" },
        ],
      },
      // 商品状态
      status: [
        {
          id: 1,
          statusName: "上架中",
        },
        {
          id: 2,
          statusName: "下架中",
        },
      ],

      /*                  步骤三                      */
      // 补充表单数据
      otherForm: {
        desc: "",
      },
      // 预览图片地址
      dialogImageUrl: "",
      // 预览图片显示
      dialogVisible: false,
      // 图片地址
      imageList: [],
      // 服务器图片地址
      imageUploadList: [],
      // 服务器图片文件列表
      imageFileList: []
    };
  },
  computed: {
    skuAttrList() {
      const result = {}
      this.categoryForm.attrKeys.forEach(
        attrKey => {
          result[attrKey.name] = attrKey.value;
        }
      )
      return result;
    },
    // 服装入库参数
    addProductParams() {
      let name = ''
      this.categoryForm.attrKeys.forEach(
        attrKey => {
          name = name + '-' + attrKey.value
        }
      )
      return {
        skuId:this.categoryForm.skuId,
        barCode: this.getRandom(1, 1000),
        spuId: this.categoryForm.spuId,
        skuName: `${this.categoryForm.productName}` + name,
        skuDesc: this.otherForm.desc,
        skuAttrList: JSON.stringify(this.skuAttrList),
        image: !this.imageUploadList?'':this.imageUploadList.join(),
        stock: this.productForm.num,
        price: this.productForm.price,
        marketPrice: this.productForm.marketPrice,
        publishStatus: this.productForm.status,
      };
    },
  },
  watch: {
    // 监听商品款式
    "categoryForm.spuId"() {
      if(this.categoryForm.spuId != null && this.categoryForm.spuId != '') {
        this.getSpuListById();
      }
    },
  },
  created() {
    // 根据商品修改的参数进行赋值
    console.log("路由参数", this.$route.query);
    const query = this.$route.query;
    if(query.type){
      this.type=query.type
      this.categoryForm.skuId=query.row.skuId
      this.categoryForm.spuId = query.row.spuId;
      this.categoryForm.productName=query.row.productName
      this.getSpuListById()
      const attrKeys = query.row.skuAttrList
      for(var attrKey in attrKeys){
        const attr = {
          name: attrKey,
          value: attrKeys[attrKey]
        }
        this.categoryForm.attrKeys.push(attr)
      }
      // this.categoryForm.color=query.row.attrKeys['颜色']
      // this.categoryForm.size=query.row.attrKeys['尺寸']
      this.productForm.price=query.row.price
      this.productForm.marketPrice=query.row.marketPrice
      this.productForm.num=query.row.stock
      this.productForm.status=query.row.publishStatus
      this.otherForm.desc=query.row.skuDesc
      this.imageUploadList=query.row.imageList||[]
      query.row.imageList&&query.row.imageList.forEach(item => {
        this.imageFileList.push({
          name:item,
          url:item
        })
      })
    }
    // 获取商品款式
    this.getSpuList();
  },
  methods: {
    // 提交
    onsubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 调用接口
          console.log(this.addProductParams);
          if(this.type==1){
            updateProduct(this.addProductParams).then(res => {
              console.log('修改商品',res)
              this.$message({
                type: "success",
                message: "修改成功",
              });
              this.$router.back()
            })
          }else{
            addProduct(this.addProductParams).then((res) => {
              console.log("添加商品", res);
              this.$message({
                type: "success",
                message: "添加成功",
              });
            });
          }
          // 清空表格
          this.productForm = this.$options.data().productForm;
          this.categoryForm = this.$options.data().categoryForm;
          this.otherForm = this.$options.data().otherForm;
          this.imageList=[]
          this.imageUploadList=[]
          this.imageFileList=[]
          // 跳转为第一个步骤
          this.active = 0;
        } else {
          this.$message.error("添加失败");
          return false;
        }
      });
    },
    // 上一步
    before() {
      this.active--;
    },
    // 下一步
    next(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.active++;
        } else {
          return false;
        }
      });
    },
    // 图片上传前
    beforeUpload(file) {
      // console.log(file);
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("不支持上传该图片格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 图片上传成功
    handleSuccessUpload(response, file, fileList) {
      // console.log("图片上传", response);
      const { bucketName, fileName } = response.data;
      const imageUrl = `http://43.139.27.107:1532/${bucketName}/${fileName}`;
      const imageFileList={
        name:imageUrl,
        url:imageUrl
      }
      this.imageList.push(file.name);
      this.imageUploadList.push(imageUrl);
      this.imageFileList.push(imageFileList)
      this.$message({
        type: "success",
        message: "图片上传成功",
      });
    },
    // 图片上传失败
    handleErrorUpload(error, file, fileList) {
      console.log(error, file, fileList);
      this.$message.error("图片上传失败，请稍后重试");
    },
    // 图片删除
    handleRemove(file) {
      const index = this.imageList.findIndex((item) => {
        return item === file.name;
      });
      // console.log("删除图片下标", index);
      this.imageList.splice(index, 1);
      this.imageUploadList.splice(index, 1);
    },
    // 预览图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 生成[min,max]的随机整数
    getRandom(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    // 获取商品款式
    getSpuList(productName = "") {
      listSpuByPage({
        currentPage: 1,
        pageSize: 100,
        productName: productName,
        productDesc: "",
        categoryId: "",
      }).then((res) => {
        console.log("商品款式", res);
        // 没有传入productName则是请求全部列表
        const list = res.data.data.data;
        if (!productName) {
          this.spuList = list;
        } else {
          this.categoryForm.spuId = list[0].productId;
          this.categoryForm.categoryName = list[0].categoryName;
        }
      });
    },
    // 根据id查询
    getSpuListById() {
      listSpuById(this.categoryForm.spuId).then((res) => {
        console.log("按id查询", res);
        this.categoryForm.productName = res.data.data.productName;
        this.categoryForm.categoryName = res.data.data.categoryName;
        this.attrList = res.data.data.attrKeys;
      });
    },
    selectSpu() {
      getAttrKeyBySpuId(this.categoryForm.spuId).then(res => {
        if(res.data.code == 200) {
          this.categoryForm.attrKeys = (res.data.data || []).map(
            (item) => {
              return {
                name: item.attrName,
                value: ''
              }
            }
          );
          console.log(this.categoryForm.attrKeys)
        }else {
          this.$message.error("查询规格属性出错")
        }
      })
    }
  },
};
</script>

<style scoped>
.step1 {
  display: flex;
  justify-content: center;
  align-content: center;
}
.step2 {
  display: flex;
  justify-content: center;
  align-content: center;
}
.step3-button {
  display: flex;
  justify-content: center;
  align-content: center;
}
</style>
