<template>
  <div style="padding: 30px;">
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="danger" @click="deleteMore">批量删除</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <el-tabs @tab-click="handleClick" value="first">
      <el-tab-pane label="全部订单" name="first">
        <el-dialog title="查看订单" :visible.sync="isScan" @close="cancel">
          <el-form inline class="demo-table-expand">
            <el-form-item label="订单编号">
              <span>{{ scanList.id }}</span>
            </el-form-item>
            <el-form-item label="课程名称">
              <span>{{ scanList.group_name }}</span>
            </el-form-item>
            <el-form-item label="用户名">
              <span>{{ scanList.username }}</span>
            </el-form-item>
            <el-form-item label="商品金额">
              <span>{{ scanList.price }}</span>
            </el-form-item>
            <el-form-item label="交易金额">
              <span>{{ scanList.pay }}</span>
            </el-form-item>
            <el-form-item label="交易时间">
              <span>{{ scanList.buy_time }}</span>
            </el-form-item>
          </el-form>
        </el-dialog>
        <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" opt="scan"
          @scan="scan" @changeTableSort="changeTableSort"></Table>
      </el-tab-pane>
      <el-tab-pane label="未付款" name="second">
        <el-dialog title="修改订单" :visible.sync="isShow" @close="cancel">
          <Form :formLabel="operateFormLabel" :form="operateForm" ref="form"></Form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
          </div>
        </el-dialog>
        <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
          opt="normal" @del="del" @edit="edit" @changeTableSort="changeTableSort"></Table>
      </el-tab-pane>
      <el-tab-pane label="已付款" name="third">
        <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
          opt="review" @del="del" @changeTableSort="changeTableSort"></Table>
      </el-tab-pane>
      <el-tab-pane label="已取消" name="fourth">
        <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
          opt="review" @del="del" @changeTableSort="changeTableSort"></Table>
      </el-tab-pane>
      <el-tab-pane label="回收站" name="fifth">
        <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
          opt="recycle" @recycle="recycle" @del="delForever" @handleSelectionChange="handleSelectionChange"
          @changeTableSort="changeTableSort"></Table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as order from '../../network/manage/order.js'
  export default {
    name: "Order",
    components: {
      Table,
      Form,
      SearchForm
    },
    data() {
      return {
        operateType: 'add',
        status: 4,
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        searchList: [],
        multipleSelection: [],

        content: [],
        isShow: false,
        isScan: false,
        scanList: [],
        nextID: 0,
        tableLabel: [{
            prop: 'id',
            label: '订单号',
            sort: true,
            width: 150
          },
          {
            prop: 'group_name',
            label: '课程名称',
            sort: true,
            width: 280
          },
          {
            prop: 'username',
            label: '用户名',
            width: 120
          },
          {
            prop: 'pay',
            prop2: 'price',
            label: '订单金额',
            sort: true,
            width: 150,
            money: true
          },
          {
            prop: 'buy_time',
            label: '交易时间',
            sort: true,
            width: 150
          },
          {
            prop: 'status',
            label: '订单状态',
            width: 150,
            tag: true
          }
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          id: '',
          group_name: '',
          username: '',
          pay: '',
          buy_time: '',
          status: ''
        },
        operateFormLabel: [{
            model: 'id',
            label: 'ID',
            type: 'input',
            show: false,
            disabled: true
          },
          {
            model: 'group_name',
            label: '课程名称',
            type: 'input',
            show: true,
            disabled: true
          },
          {
            model: 'username',
            label: '用户名',
            type: 'input',
            show: true,
            disabled: true
          },
          {
            model: 'price',
            label: '商品金额',
            type: 'number',
            show: true,
            disabled: true
          },
          {
            model: 'pay',
            label: '订单金额',
            type: 'number',
            show: true
          },
          {
            model: 'buy_time',
            label: '交易时间',
            type: 'date',
            show: false
          },
          {
            model: 'status',
            label: '订单状态',
            type: 'select',
            show: false,
            opts: [{
              label: '未付款',
              value: 0
            }, {
              label: '已付款',
              value: 1
            }, {
              label: '已取消',
              value: 2
            }, {
              label: '已删除',
              value: 3
            }]
          },
        ],
        formOptions: [{
            label: '订单号',
            prop: 'id',
            element: 'el-input'
          },
          {
            label: '课程',
            prop: 'group_name',
            element: 'el-input'
          },
          {
            label: '用户名',
            prop: 'username',
            element: 'el-input'
          },
        ],
      }
    },
    methods: {
      // 切换tab
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.status = 4
        } else if (tab.name === 'second') {
          this.status = 0
        } else if (tab.name === 'third') {
          this.status = 1
        } else if (tab.name === 'fourth') {
          this.status = 2
        } else if (tab.name === 'fifth') {
          this.status = 3
        }
        this.getList()
      },
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val

        this.searchTableData = this.oldData.filter(item => {
          return item.id.match(this.searchList.id) && item.group_name.match(this.searchList.group_name) && item
            .username.match(this.searchList.username)
        })
        this.config.total = this.searchTableData.length // 重新定义分页总数
        this.searchTableData = this.spArr(this.searchTableData, 10)
        this.filterTableData = this.searchTableData[0]
        this.isSearch = true
        this.searchList = []
      },
      // 重置数据
      onReset() {
        this.filterTableData = this.tableData[0]
        this.isSearch = false
        this.config.page = 1
      },
      // 显示/ 筛选数据
      showData(page) {
        this.config.page = page
        if (this.isSort) { // 已排序调用排序的数据
          this.filterTableData = this.sortTableData[page - 1]
        } else if (this.isSearch) {
          this.filterTableData = this.searchTableData[page - 1]
        } else {
          this.filterTableData = this.tableData[page - 1]
        }
      },
      // 排序
      changeTableSort(val) {
        // console.log(val)
        this.config.page = 1
        if (val.order == null) { // 未排序
          this.isSort = false
          this.filterTableData = this.tableData[this.config.page - 1]
        } else { // 正倒序
          this.sortTableData = this.spArr(this.oldData.sort(this.sortTable(val.prop, val.order == "ascending")), 10)
          this.filterTableData = this.sortTableData[this.config.page - 1]
          this.isSort = true
        }
      },
      sortTable(col, rev) {
        if (rev == undefined) {
          rev = 1
        } else {
          rev = (rev) ? 1 : -1
        }

        return function(a, b) {
          a = a[col]
          b = b[col]
          if (a < b) {
            return rev * -1
          }
          if (a > b) {
            return rev * 1
          }
          return 0
        }
      },
      // 切分数组
      spArr(arr, num) {
        let newArr = []
        for (let i = 0; i < arr.length;) {
          newArr.push(arr.slice(i, i += num));
        }
        return newArr
      },
      getList() {
        this.config.loading = true
        order.getOrderList(this.status).then(res => {
            console.log(res.data)
            if (res.data.error_code == 0) {
              this.oldData = res.data.data.list
              this.tableData = this.oldData
              this.tableData = this.spArr(this.tableData, 10)
              this.filterTableData = this.tableData[this.config.page - 1]

              this.config.total = this.oldData.length
              this.config.loading = false
              this.nextID = res.data.data.nextID
            } else {
              this.$message({
                type: 'info',
                message: '暂无数据'
              })
              this.config.loading = false
              this.oldData = []
              this.tableData = []
              this.filterTableData = []
            }

          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '暂无数据'
            })
            this.config.loading = false
            this.oldData = []
            this.tableData = []
            this.filterTableData = []
          })
      },
      edit(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
      },
      confirm() {
        if (this.operateType === 'edit') {
          console.log("edit")
          order.editOrder(this.$refs.form.form).then(res => {
            console.log(res.data)
            this.isShow = false
          })
        }
      },
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            order.delOrder(row.id).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '删除成功!（可在回收站一栏查看）'
              })
              this.getList()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      delForever(row) {
        console.log("DELForever")
        this.$confirm('此操作将永久删除此订单，不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            order.deleteForever(row.id)
              .then(res => {
                console.log(res.data)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList()
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 批量删除
      deleteMore() {
        console.log("DELMORE")
        var deleteList = []
        this.multipleSelection.forEach(item => {
          deleteList.push(item.id)
        })
        this.$confirm('此操作将批量永久删除所选订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            order.deleteMore(deleteList)
              .then(res => {
                console.log(res.data)
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList()
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      recycle(row) {
        console.log("Recycle")
        this.$confirm('此操作将恢复此订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            order.recycleOrder(row.id)
              .then(res => {
                console.log(res.data)
                this.$message({
                  type: 'success',
                  message: '恢复成功!(在已取消一栏可查看)'
                })
                this.getList()
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消恢复'
            })
          })
      },
      scan(row) {
        console.log('scan')
        this.scanList = row
        this.scanList.price = Math.round(this.scanList.price * 100) / 100;
        this.scanList.pay = Math.round(this.scanList.pay * 100) / 100;
        var s = this.scanList.price.toString().split(".");
        if (s.length == 1) {
          this.scanList.price = this.scanList.price.toString() + ".00";
        } else if (s.length > 1) {
          if (s[1].length < 2) {
            this.scanList.price = this.scanList.price.toString() + "0";
          }
        }
        var s = this.scanList.pay.toString().split(".");
        if (s.length == 1) {
          this.scanList.pay = this.scanList.pay.toString() + ".00";
        } else if (s.length > 1) {
          if (s[1].length < 2) {
            this.scanList.pay = this.scanList.pay.toString() + "0";
          }
        }
        this.scanList.price = '¥' + this.scanList.price
        this.scanList.pay = '¥' + this.scanList.pay
        this.isScan = true

      },
      cancel() {
        this.$refs.form.$children[0].resetFields()
        this.getList()
      },
    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table__body {
    font-size: 13px !important;
  }

  ::v-deep .ql-container.ql-snow {
    height: 150px;
  }

  ::v-deep .common-table .pager {
    position: relative;
  }

  ::v-deep .demo-table-expand label {
    font-weight: bold;
    width: 100px;
    margin-right: 10px;
  }

  ::v-deep .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
  }
</style>
