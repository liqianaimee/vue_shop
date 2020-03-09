<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 卡片视图区域 -->
      <el-card>
        <el-row>
          <el-col :span="8">
            <el-input placeholder="">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <!--订单列表数据-->
        <el-table :data="orderList" border stripe row-key="order_id">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="订单编号" prop="order_number"></el-table-column>
          <el-table-column label="订单价格" prop="order_price"></el-table-column>
          <el-table-column label="是否付款" prop="pay_status">
            <template slot-scope="scope">
              <el-button plain v-if="scope.row.pay_status === '1'" size="mini" type="success">已付款</el-button>
              <el-button plain v-else size="mini" type="danger">未付款</el-button>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="is_send"></el-table-column>
          <el-table-column label="下单时间">
            <template slot-scope="scope">
              {{scope.row.create_time|dateFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showBox(scope.row)"></el-button>
              <el-button type="success" size="mini" icon="el-icon-location" @click="showProgressBox(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--修改地址的对话框-->
      <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        width="50%"
        @close="handleClose">
        <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" >
          <el-form-item label="省市区县" prop="address1">
            <el-cascader v-model="addressForm.address1" :options="cityData">
            </el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button  @click="addressVisible = false ">取 消</el-button>
          <el-button type="primary" @click="addressVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!--查看物流-->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in progressInfo"
            :key="index"
            :icon="activity.icon"
            :type="activity.type"
            :color="activity.color"
            :size="activity.size"
            :timestamp="activity.time">
            {{activity.context}}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'
export default {
  data() {
    return {
      // 获取订单列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      orderList: [],
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址表单数据对象
      addressForm: {
        address1: [],
        address2: ''
      },
      // 表单验证规则对象
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    // 监听pagesize的改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听pagenum改变
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 监听对话框的关闭
    handleClose() {
      this.$refs.addressFormRef.resetFields()
    },
    // 控制修改地址对话框的显示
    showBox(row) {
      this.addressVisible = true
    },
    // 控制物流对话框的显示
    async showProgressBox(row) {
      const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流进度失败！')
      }
      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader{
  width: 100%;
}
</style>
