<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单查询</span>
      </div>
      <el-form ref="saleRecordForm" :inline="true" :model="saleRecordForm" class="box-form">
        <el-row :gutter="2" type="flex" justify="center" align="center">
          <el-col :span="7">
            <el-form-item label="编号:" prop="orderId">
              <el-input v-model="saleRecordForm.orderId" placeholder="请输入订单编号" style="width:150%" />
            </el-form-item>
          </el-col>
          <el-col :span="6" style="margin-left: 5%;">
            <el-form-item>
              <el-button v-hasAuthority="['order:order:query']" type="primary" icon="el-icon-search" size="medium" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="dataList"> 
        <el-table-column type="expand">
          <template slot-scope="prop">
            <el-table :data="prop.row.orderItems" border>
              <el-table-column fixed label="订单项ID" align="center" prop="orderItemId" width="90" />
              <el-table-column fixed label="商品条码" align="center" prop="barCode" width="90" />
              <el-table-column label="商品名称" align="center" prop="skuName">
                <template slot-scope="scope">
                  <el-popover placement="top-start" title="名称：" width="200" trigger="hover" :content="scope.row.skuName">
                    <p slot="reference" class="ellipsis">{{ scope.row.skuName }}</p>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="规格" align="center" prop="skuAttrsVals">
                <template slot-scope="scope">
                  <p v-for="(value, key) in scope.row.skuAttrsVals" :key="key">
                    {{ key }} : {{ value }}
                  </p>
                </template>
              </el-table-column>
              <el-table-column label="价格" align="center" prop="skuPrice" />
              <el-table-column label="数量" align="center" prop="skuQuantity" />
              <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.status == '1'" size="medium" type="danger">未付款</el-tag>
                  <el-tag v-else-if="scope.row.status == '2'" size="medium" type="success">已付款</el-tag>
                  <el-tag v-else-if="scope.row.status == '3'" size="medium">已发货</el-tag>
                  <el-tag v-else-if="scope.row.status == '4'" size="medium" type="warning">部分退货</el-tag>
                  <el-tag v-else size="medium" type="info">已退货</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="退货数量" align="center" prop="returnQuantity" />
              <el-table-column label="日期" align="center" prop="createTime" :formatter="formatDate" />
              <el-table-column fixed="right" label="操作" align="center" width="168" class-name="small-padding fixed-width">
                <template slot-scope="scope">
                  <el-button v-hasAuthority="['order:order:return']" :disabled="scope.row.status == 5 || scope.row.status == 1" size="small" type="text" icon="el-icon-back" @click="handleReturn(scope.row)">退货</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column fixed label="订单ID" align="center" prop="orderId" width="80" />
        <el-table-column label="订单流水号" align="center" prop="orderNo" width="145" />
        <el-table-column label="会员Id" align="center" prop="memberId" />
        <el-table-column label="购买者" align="center" prop="memberUsername" />
        <el-table-column label="订单总额" align="center" prop="totalAmount" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == '1'" size="medium">已创建</el-tag>
            <el-tag v-else-if="scope.row.status == '2'" size="medium" type="danger">未支付</el-tag>
            <el-tag v-else-if="scope.row.status == '3'" size="medium" type="warning">已支付</el-tag>
            <el-tag v-else-if="scope.row.status == '4'" size="medium" type="success">已完成</el-tag>
            <el-tag v-else-if="scope.row.status == '5'" size="medium" type="info">已取消</el-tag>
            <el-tag v-else-if="scope.row.status == '6'" size="medium" type="info">部分退货</el-tag>
            <el-tag v-else size="medium" type="info">已退单</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="note">
          <template slot-scope="scope">
            <el-popover placement="top-start" title="订单描述：" width="200" trigger="hover" :content="scope.row.note">
              <p slot="reference" class="note">{{ scope.row.note }}</p>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" :formatter="formatDate" />
        <el-table-column fixed="right" label="操作" align="center" width="168" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.status != 1 && scope.row.status != 2"
              size="small"
              type="text"
              icon="el-icon-back"
              @click="continueOrder(scope.row)"
            >继续订单</el-button>
            <el-button
              v-hasAuthority="['order:order:return']"
              :disabled="scope.row.status == 7 || scope.row.status == 5 || scope.row.status <= 2"
              size="small"
              type="text"
              icon="el-icon-back"
              @click="handleSelectionReturn(scope.row)"
            >退单/退货</el-button>
            <el-button
              v-hasAuthority="['order:order:remove']"
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
            >删除</el-button>
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

      <!-- 退货对话框 -->
      <el-dialog title="请选择退货数量" :visible.sync="open" width="400px" append-to-body>
        <el-form ref="returnForm" :model="returnForm">
          <el-form-item label="退货数量:" prop="skuQuantity">
            <el-input-number v-model="returnForm.skuQuantity" style="width:205px;margin-left: 5%;" :min="1" :max="returnForm.max" />
          </el-form-item>
          <el-form-item label="退货原因:" prop="returnReason">
            <el-select v-model="returnForm.returnReason" class="select" multiple filterable allow-create default-first-option placeholder="请选择">
              <el-option v-for="item in returnOptions" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-form>
        <!-- 数据提交操作按钮 -->
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="open=false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 退货<上>对话框 -->
      <el-dialog title="退货" :visible.sync="opens" width="900px" append-to-body>
        <el-table :data="returnData" @selection-change="handleSelectionChange">
          <el-table-column :selectable="isSelectable" type="selection" width="50" align="center" />
          <el-table-column label="订单项ID" align="center" prop="orderItemId" width="90" />
          <el-table-column label="商品条码" align="center" prop="barCode" width="90" />
          <el-table-column label="商品名称" align="center" prop="skuName">
            <template slot-scope="scope">
              <el-popover placement="top-start" title="名称：" width="200" trigger="hover" :content="scope.row.skuName">
                <p slot="reference" class="ellipsis">{{ scope.row.skuName }}</p>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center" prop="skuAttrsVals">
            <template slot-scope="scope">
              <p v-for="(value, key) in scope.row.skuAttrsVals" :key="key">
                {{ key }} : {{ value }}
              </p>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center" prop="skuPrice" />         
          <el-table-column label="数量" align="center" prop="skuQuantity" width="160">
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.skuQuantity" size="small" :min="0" :max="num[scope.$index]" @change="changeQuantity(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column label="退货数量" align="center" prop="returnQuantity" />
          <el-table-column label="日期" align="center" prop="createTime" :formatter="formatDate" />
        </el-table>
        <el-form :model="returnForm" class="returnSelectForm">
          <el-form-item label="退货原因:" prop="reason" label-width="100px">
            <el-select v-model="returnForm.returnReason" multiple filterable allow-create default-first-option placeholder="请选择">
              <el-option v-for="item in returnOptions" :key="item.value" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitTable">确 定</el-button>
          <el-button @click="opens=false">取 消</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { listOrderByPage, getOrder, delOrder, returnOrderItem} from '@/api/sale/orderRecord'
import { getReturnByOrderItemId } from '@/api/sale/return'
export default {
  data(){
    return {
      loading: true,
      saleRecordForm: {
        orderId: null
      },
      // 分页数据
      page: {
        currentPage: 1,
        totalPage: 0,
        pageSize: 5,
        totalData: 0,
      },
      // 外部表格数据
      dataList: [],
      // 对话框数据
      form:{},
      // 是否显示弹出层
      open: false, 
      opens: false, 
      // 退货数据
      returnForm: {
        orderId: '',
        orderItemId: '',
        returnReason: '',
        orderItemDTOs: [],
        skuQuantity: '',
      },
      returnData: [],
      // 退货原因
      returnOptions: [
        {
          value: '1',
          label: '质量问题'
        },
        {
          value: '2',
          label: '产品与描述不符'
        },
        {
          value: '3',
          label: '少件/发错/迟发货'
        },
        {
          value: '4',
          label: '商品破损/包装问题'
        },
        {
          value: '5',
          label: '购买错误'
        },        
      ],
      // 被选择的数据
      selectedData: [],
      // 暂存数量
      num:[]
    }
  },
  computed: {
    // 分页查询参数
    listByPageParams() {
      return {
        currentPage: this.page.currentPage,
        pageSize: this.page.pageSize,
        orderNo: this.saleRecordForm.orderId
      };
    },

  },
    // 生命周期-创建完成，可选
  created() {
    this.getList();
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      // 结果复制this.dataList
      listOrderByPage(this.listByPageParams).then((response) => {
        const orderList = response.data.data.data
        orderList.forEach(element => {
          element.orderItems.forEach(e => {
            e.skuAttrsVals = JSON.parse(e.skuAttrsVals)
          })
        });
        for( let j=0;j<orderList.length;j++){
          const list = JSON.parse(JSON.stringify(orderList[j].orderItems));
          for(let i=0;i<list.length;i++) {
            getReturnByOrderItemId(list[i].orderItemId).then(response => {
              const returnQuantity = response.data.data
              list[i].returnQuantity = returnQuantity
              })
          }
          orderList[j].orderItems=list
        }
        this.dataList = orderList
        this.page.currentPage = response.data.data.currentPage;
        this.page.totalData = response.data.data.totalData;
        this.loading = false
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectedData = selection.map((item) => {
        return Object.assign({}, {orderId:item.orderId, orderItemId: item.orderItemId, skuQuantity: item.skuQuantity})
      })
    },
    // 查询
    handleQuery() {
      this.resetQuery
      this.getList()
      this.$message.success('查询成功')
    },
    // 重置表单
    resetQuery(){
      this.$refs.saleRecordForm.resetFields()
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

    // 重置退货表单
    resetForm(){
      this.returnForm={
        orderId: '',
        orderItemId: '',
        returnReason: '',
        orderItemDTOs: [],
        skuQuantity: ''
      }
    },
    resetTable(){
      this.returnData=[]
      this.selectedData=[]
      this.num=[]
    },

    // 退货
    handleReturn(row){
      this.resetForm()
      this.open=true
      this.returnForm.orderId = row.orderId
      this.returnForm.orderItemId = row.orderItemId
      getReturnByOrderItemId(row.orderItemId).then(response => {
        const returnQuantity = response.data.data
        this.returnForm.max = row.skuQuantity - returnQuantity
      })
    },
    submitForm() {
      const orderItemDTO = {
        orderItemId: this.returnForm.orderItemId,
        skuQuantity: this.returnForm.skuQuantity
      }
      this.returnForm.returnReason = this.returnForm.returnReason == '' ? '' : this.returnForm.returnReason.join(",")
      this.returnForm.orderItemDTOs.push(orderItemDTO)
      returnOrderItem(this.returnForm).then(response => {
        if (response.data.code == 200) {
          this.$message({
            type: "success",
            message: "退货成功!",
          });
        } else {
          this.$message.error("退货失败");
        }
        this.getList()
        this.open=false
      })
    },

    handleSelectionReturn(row){
      this.resetForm()
      this.resetTable()
      this.returnForm.orderId = row.orderId
      const list = JSON.parse(JSON.stringify(row.orderItems));
      list.forEach(
        item => {
          this.num.push(item.skuQuantity - item.returnQuantity)
          item.skuQuantity = item.skuQuantity - item.returnQuantity
        }
      )
      this.returnData = list
      this.opens=true
    },
    submitTable(){
      this.selectedData.forEach(
        item => {
          const orderItemDTO = {
            orderItemId: item.orderItemId,
            skuQuantity: item.skuQuantity
          }
          this.returnForm.orderItemDTOs.push(orderItemDTO)
        }
      )
      this.returnForm.returnReason = this.returnForm.returnReason == '' ? '' : this.returnForm.returnReason.join(",")
      returnOrderItem(this.returnForm).then(response => {
        if (response.data.code == 200) {
          this.$message({
            type: "success",
            message: "退货成功!",
          });
        } else {
          this.$message.error("退货失败");
        }
        this.getList()
        this.opens=false
      })
    },

    // 删除订单
    handleDelete(row){
      console.log(row)
      this.$confirm("此操作将永久删除当前订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delOrder(row.orderId).then((res) => {
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

    // 时间格式转化
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
    },

    isSelectable(row, index) {
      if(row.skuQuantity == 0) {
        return false;
      }else {
        return true;
      }
    },

    changeQuantity(row) {
      this.selectedData.forEach(
        item => {
          if(item.orderItemId == row.orderItemId) {
            item.skuQuantity = row.skuQuantity
          }
        }
      )
    },

    continueOrder(row) {
      // console.log(row)
      let step = 0;
      if(row.status == 1) {
        step = 2;
      }
      if(row.status == 2) {
        step = 4;
      }
      this.$router.push({
        path:"/sale/sale",
        query:{
          row: row,
          step: step
        },
      })
    }
  }

}
</script>

<style lang="less" scoped>

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin:1% 0;
    width: 100%;
    
  }

  .formbuttom {
    margin-left: 30px;
  }

  .el-table {
    width: 100%;
  }

  .select{
    margin-left: 5%;
  }

  .returnSelectForm{
    margin-top: 5%;
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .dialog-footer{
    display: flex;
    justify-content: center;
  }

  .note{
    //超出两行省略号
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    line-clamp: 1;
    -webkit-line-clamp: 1; //显示几行
  }

  .ellipsis{
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  -webkit-line-clamp: 3;
}
</style>