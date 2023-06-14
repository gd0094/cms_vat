<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-form ref="memberForm" class="member" :model="memberForm" label-width="120px" style="margin: 10px">
        <el-form-item label="会员手机号：">
          <el-input v-model="memberForm.phone" placeholder="请输入会员手机号" style="width: 500px">
            <el-button slot="append" @click="queryMember">确认</el-button>
          </el-input>
          <el-button v-hasAuthority="['order:order:makeNewSale']" type="success" size="small" round :disabled="step!==1" class="first-button" @click="makeNewSale">开始销售</el-button>
          <el-button v-hasAuthority="['order:order:completeOrder']" type="primary" size="small" round :disabled="step !==5" @click="completeSale">完成订单</el-button>
          <el-button v-hasAuthority="['order:order:cancelOrder']" type="danger" size="small" round :disabled="step == 1" @click="cancelSale">取消订单</el-button>
          <el-button type="warning" size="small" round :disabled="step !==2" @click="pendingOrder">暂挂订单</el-button>
        </el-form-item>
      </el-form>
      
    </el-row>
    <el-row :gutter="20">
      <!-- 左侧商品、支付信息录入表单 -->
      <el-col :span="6" :xs="24">
       
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>商品录入</span>
          </div>
          <el-form ref="enterItemForm" :model="enterItemForm" :rules="enterItemRules" size="small" label-width="80px">
            <el-form-item label="商品编码" prop="barCode">
              <el-input v-model="enterItemForm.barCode" placeholder="请输入条码" clearable @keyup.enter.native="enterItem" />
            </el-form-item>
            <el-form-item label="订购数量" prop="skuQuantity">
              <el-input v-model.number="enterItemForm.skuQuantity" clearable @keyup.enter.native="enterItem" />
            </el-form-item>
            <el-row :gutter="10">
              <el-col :span="12">
                <el-button v-hasAuthority="['order:order:enterItem']" type="primary" size="mini" :disabled="step!==2" @click="enterItem">输入商品</el-button>
              </el-col>
              <el-col :span="12">
                <el-button v-hasAuthority="['order:order:endSale']" type="warning" size="mini" :disabled="step !==2 || saleItemList.length == 0" @click="endSale">结束销售</el-button>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
        <el-card class="box-card" style="margin-top: 6%;">
          <div slot="header" class="clearfix">
            <span>订单支付</span>
            <el-button v-hasAuthority="['order:order:tradePrecreate']" style="float: right" size="mini" :disabled="step!==4" type="primary" @click="tradePreCreate">支付宝支付</el-button>
          </div>

          <el-form ref="makePaymentForm" :model="makePaymentForm" :rules="makePaymentRules" size="small" label-width="80px">
            <el-form-item label="折扣" prop="discount">
              <el-input v-model="discount" disabled />
            </el-form-item>
            <el-form-item label="最终金额" prop="resultAmount">
              <el-input v-model="resultAmount" disabled />
            </el-form-item>
            <el-form-item label="付款金额" prop="payAmount">
              <el-input v-model.number="makePaymentForm.payAmount" />
            </el-form-item>
            <el-form-item label="找零">
              <el-input v-model="changeDue" disabled />
            </el-form-item>
            <el-form-item>
              <el-button v-hasAuthority="['order:order:makePayment']" type="danger" size="mini" :disabled="step!==4" @click="makePayment">现金支付</el-button>
            </el-form-item>
          </el-form>

          <el-dialog
            title="支付宝支付二维码"
            :visible.sync="open"
            width="30%"
            center
            @close="closeDialog"
          >
            <el-image
              style="width: 100%; height: 100%"
              :src="qrCode"
              fit="cover"
            />
            <span slot="footer" class="dialog-footer">
              <el-button @click="open = false">取 消</el-button>
            </span>
          </el-dialog>
        </el-card>
      </el-col>
        
      <!-- 右侧订单及明细信息展示 -->
      <el-col :span="18" :xs="24">
        <el-descriptions border :column="3">
          <el-descriptions-item label="会员">{{ orderInfo.memberUsername }}</el-descriptions-item>
          <el-descriptions-item label="会员等级">
            <el-tag v-if="orderInfo.memberLevel === 1" size="small">VIP1</el-tag>
            <el-tag v-if="orderInfo.memberLevel === 2" size="small">VIP2</el-tag>
            <el-tag v-if="orderInfo.memberLevel === 3" size="small">VIP3</el-tag>
            <el-tag v-else size="small">无</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag v-if="orderInfo.status === 1" size="small">已创建</el-tag>
            <el-tag v-if="orderInfo.status === 2" size="small">未付款</el-tag>
            <el-tag v-if="orderInfo.status === 3" size="small">已付款</el-tag>
            <el-tag v-if="orderInfo.status === 4" size="small">已完成</el-tag>
            <el-tag v-if="orderInfo.status === 5" size="small">已取消</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="订单号">{{ orderInfo.orderNo }}</el-descriptions-item>
          <el-descriptions-item label="总金额">{{ orderInfo.totalAmount }}</el-descriptions-item>
          <el-descriptions-item label="总件数">{{ orderInfo.totalQuantity }}</el-descriptions-item>
          <el-descriptions-item label="销售时间">{{ orderInfo.saleTime }}</el-descriptions-item>
          <el-descriptions-item label="备注">暂无</el-descriptions-item>
        </el-descriptions>
        <br>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>订单明细</span>
          </div>
          <el-table :data="saleItemList" :row-class-name="rowSaleItemIndex">
            <el-table-column label="序号" align="center" prop="index" width="55" />
            <el-table-column label="商品编号" align="center" prop="barCode" />
            <el-table-column label="商品名称" align="center" prop="skuName">
              <template slot-scope="scope">
                <el-popover placement="top-start" title="名称：" width="200" trigger="hover" :content="scope.row.skuName">
                  <p slot="reference" class="ellipsis">{{ scope.row.skuName }}</p>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="规格" align="center" prop="skuAttrList">
              <template slot-scope="scope">
                <p v-for="(value, key) in scope.row.skuAttrList" :key="key">
                  {{ key }} : {{ value }}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="商品图片" align="center" prop="image" width="130">
              <template slot-scope="scope">
                <el-carousel trigger="click" height="130px">
                  <el-carousel-item v-for="item in scope.row.image" :key="item">
                    <el-image :src="item" fit="cover" :preview-src-list="scope.row.image" />
                  </el-carousel-item>
                </el-carousel>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center" prop="price" />
            <el-table-column label="数量" align="center" prop="skuQuantity" width="140">
              <template slot-scope="scope">
                <el-input-number 
                  v-model="scope.row.skuQuantity" 
                  size="mini" 
                  :disabled="step!==2" 
                  :min="1" 
                  :max="100"
                  controls-position="right"
                  @change="(currentValue,oldValue)=>handleChangeQuantity(currentValue,oldValue,scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="总价" align="center" prop="realAmount" />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right">
              <template slot-scope="scope">
                <el-button v-hasAuthority="['order:order:deleteOrderItem']" size="small" type="text" :disabled="step!==2" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {makeNewSale,enterItem,endSale,makePayment,deleteOrderItem,tradePrecreate,tradeQuery,completeOrder, cancelOrder, pendingOrder, pickOrder} from '@/api/sale/sale'
import {getMemberByPhone} from '@/api/member/member'
export default {
  name: 'Sale',
  // 定义属性
  data() {
    return {
        memberForm: {
          phone: ''
        },
        // 定时器的ID
        T:'',
        qrCode: '',
        open: false,
        // 操作步骤，控制按钮是否可用
        step: 1,
        // 订单信息
        orderInfo: {
          memberId: null,
          memberUsername: '非会员',
          totalQuantity: 0,
          totalAmount: 0
        },
        // 商品输入表单
        enterItemForm: {},
        // 支付表单 
        makePaymentForm: {},
        // 找零
        changeDue: 0,
        discount: 0,
        resultAmount: 0,
        // 订单明细
        saleItemList: [],
        // 表单校验规则
        enterItemRules: {
            barCode: [
                { required: true, message: "商品编码不能为空", trigger: "blur" }
            ],
            skuQuantity: [
                { required: true, message: "数量不能为空", trigger: "blur" },
                { type: 'number', message: '数量必须为数字'}
            ]
        },
        makePaymentRules: {
            cashTendered: [
                { required: true, message: "付款金额不能为空", trigger: "blur" },
                { type: 'number', message: '付款金额必须为数字'}
            ]
        }
    }
  },
  // 计算属性
  computed: {},
  // 监听saleItemList及其对象元素变化
  watch: { 
    saleItemList:{
        handler(val) {
            let totalQuantity = 0;
            let totalAmount = 0;
            val.map(item => { 
              totalQuantity = item.skuQuantity + totalQuantity
              totalAmount = item.realAmount + totalAmount
            })
            this.orderInfo.totalQuantity = totalQuantity;
            this.orderInfo.totalAmount = totalAmount;
        },
        deep: true // 深度监听数组对象
    }
  },
  // 生命周期-创建完成
  created() {
    this.clear();
    const query = this.$route.query;
    console.log('query',query)
    if(query.step){
      this.step = query.step
      const queryParams = {
        orderNo: query.row.orderNo
      }
      pickOrder(queryParams).then(res => {
        console.log('取单',res)
        if(res.data.code == 200) {
          this.orderInfo.memberId = res.data.data.memberId
          this.orderInfo.memberUsername = res.data.data.memberUsername == '' || res.data.data.memberUsername == undefined ? '非会员' : res.data.data.memberUsername
          this.orderInfo.memberLevel = res.data.data.memberLevel
          this.orderInfo.orderNo = res.data.data.orderNo
          this.orderInfo.totalAmount = res.data.data.totalAmount
          this.orderInfo.totalQuantity = res.data.data.totalQuantity == undefined ? 0 : res.data.data.totalQuantity
          this.orderInfo.status = res.data.data.status
          this.orderInfo.saleTime = res.data.data.saleTime
          this.saleItemList = res.data.data.orderItems
          this.saleItemList.forEach(
            item => {
              item.image = item.image.split(",")
              item.skuAttrList = JSON.parse(item.skuAttrList);
            }
          )
          this.discount = res.data.data.discount
          this.resultAmount = res.data.data.resultAmount
        }
      })
    }
  },
  methods: {
    // 步骤1：创建订单
    makeNewSale(){
        makeNewSale(this.orderInfo).then(response => {
            this.orderInfo = response.data.data;
            if(response.data.data.memberId == undefined) {
              this.orderInfo.memberUsername = "非会员"
              this.orderInfo.memberLevel = "无"
            }
            this.orderInfo.totalQuantity = 0;
            this.enterItemForm.orderNo = this.orderInfo.orderNo;
            let dt = new Date(this.orderInfo.saleTime);
            this.orderInfo.saleTime = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
        })
        this.step = 2;
    },
    // 步骤2：提交输入商品
    enterItem(){
        // barCode是否已经录入，-1为未录入
        const index = this.saleItemList.findIndex((item) => item.barCode == this.enterItemForm.barCode);
        enterItem(this.enterItemForm).then(response => {
            if(response.data.code === 200) { // 是否找到商品
                // 手动维护前端数组与后端list数组一致性
                if(index == -1){
                    response.data.data.image = response.data.data.image.split(",")
                    response.data.data.skuAttrList = JSON.parse(response.data.data.skuAttrList);
                    this.saleItemList.push(response.data.data);
                } else {
                    this.saleItemList[index].skuQuantity = response.data.data.skuQuantity;
                    this.saleItemList[index].realAmount = response.data.data.realAmount;
                }
            } else {
                this.$message.error(response.msg);
            }
        })
    },
    // 步骤3：结束输入
    endSale(){
        endSale(this.orderInfo).then(response => {
            this.orderInfo.totalAmount = response.data.data.totalAmount;
            this.orderInfo.status = response.data.data.status
            this.discount = response.data.data.discount + '%'
            this.resultAmount = response.data.data.resultAmount
        })
        this.step = 4;
    },
    // 步骤4：提交支付
    makePayment(){
      console.log(this.makePaymentForm.payAmount,this.orderInfo.totalAmount)
      if(this.makePaymentForm.payAmount >= this.resultAmount) {
          const payment = {
            orderNo: this.orderInfo.orderNo,
            payAmount: this.makePaymentForm.payAmount
          }
          makePayment(payment).then(response => {
            if(response.data.code == 200) {
              this.changeDue = response.data.data.change;
              this.$message.success("支付成功!找零"+this.changeDue +"元");
            }else{
              this.$message.error(response.data.message);
            }
          })
          this.step = 5;
      } else {
          this.$message.warning("付款金额小于订单总金额");
      }
    },
    // 步骤5：完成订单
    completeSale() {
      completeOrder(this.orderInfo).then(response => {
        if(response.data.code == 200) {
          this.clear();
          this.step = 1;
          this.$message.success("订单已完成");
        }
      })
    },
    // 取消订单
    cancelSale() {
      if(this.step == 4 || this.step == 5) {
        cancelOrder(this.orderInfo).then(response => {
          if(response.data.code == 200) {
            this.clear();
            this.step = 1;
            this.$message.warning("订单已取消");
          }
        })
      }else{
        this.clear();
        this.step = 1;
        this.$message.warning("订单已取消");
      }
    },
    // 删除一行订单明细
    handleDelete(row){
       const index = row.index -1;
       const item = {
        orderNo: this.orderInfo.orderNo,
        barCode: row.barCode
       }
       deleteOrderItem(item).then(response => {
          if(response.data.code == 200) {
            this.saleItemList.splice(index,1);
            this.$message.success(response.data.message);
          } else {
            this.$message.warning(response.data.message);
          } 
       })
    },
    // 修改一行订单明细数量
    handleChangeQuantity(currentValue, oldValue, row){
        console.log("currentValue:"+currentValue)
        console.log("oldValue:"+oldValue)
        console.log(row)
        const saleItem = {
          orderNo: this.orderInfo.orderNo,
          barCode: row.barCode,
          skuQuantity: currentValue - oldValue
        }
        enterItem(saleItem).then(response => {
          if(response.data.code === 200) { // 是否找到商品
            row.skuQuantity = response.data.data.skuQuantity
            row.realAmount = response.data.data.realAmount  
          } else {
            this.$message.error(response.msg);
          }
        })

        // console.log("skuQuantity:"+row.skuQuantity);
        // changeQuantity(row).then(response => {
        //     this.$message.success(response.msg);
        // })
    },
    // 清空界面数据
    clear(){
        this.orderInfo = {
          memberId: null,
          memberUsername: '非会员',
          totalQuantity: 0,
          totalAmount: 0
        };
        this.saleItemList = [];
        this.enterItemForm = {
            barCode: '',
            skuQuantity: 1
        };
        this.makePaymentForm = {
            cashTendered: 0
        };
        this.changeDue = 0;
        this.discount = 0
        this.resultAmount = 0
        this.totalQuantity = 0;
        this.step = 1;
    },
    // 给Table加序号
    rowSaleItemIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    tradePreCreate() {
      this.open = true
      const data = {
        orderNo: this.orderInfo.orderNo
      }
      tradePrecreate(data).then(response => {
        this.qrCode = response.data.message
        this.loopOrderState()
      })
    },
    // 轮询当前订单状态
    loopOrderState(){
      this.T = setInterval(() => {
        console.log("查询中")
        const params = {
          orderNo: this.orderInfo.orderNo
        }
        tradeQuery(params).then(response => {
          if(response.data.data == 1) {
            clearInterval(this.T)
            this.$message.success("支付成功！");
            this.open = false;
            this.step = 5;
          }
        })
      }, 5000)
    },
    closeDialog() {
      clearInterval(this.T)
    },

    queryMember() {
      getMemberByPhone(this.memberForm).then(response => {
        if(response.data.code == 200) {
          this.orderInfo.memberId = response.data.data.memberId
          this.orderInfo.memberUsername = response.data.data.name
          this.orderInfo.memberLevel = response.data.data.memberLevel
          this.$message.success("查询成功")
        }else {
          this.$message.error(response.msg);
        }
      })
    },

    pendingOrder() {
      const data = {
        orderNo: this.orderInfo.orderNo
      }
      pendingOrder(data).then(res => {
        if(res.data.code == 200) {
          this.clear()
          this.$message.success("挂单成功")
        }else {
          this.$message.error("挂单失败");
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
// 取消走马灯下方指示条
/deep/ .el-carousel__indicators{
  display: none;
}
.ellipsis{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  line-clamp: 4;
  -webkit-line-clamp: 4;
}
.first-button{
  margin-left:80px;
}
@media screen and(width:1280px){
  .first-button{
    margin-left:30px;
    }
}
</style>