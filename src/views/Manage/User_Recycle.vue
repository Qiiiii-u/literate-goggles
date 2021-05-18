<template>
  <div style="padding: 30px;">
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="recycleMore">批量恢复</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
      @recycle="recycleUser" :opt="opt" @handleSelectionChange="handleSelectionChange" @del="delUser"
      @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_user from '../../network/manage/user_recycle.js'
  export default {
    name: "User_Recycle",
    components: {
      Table,
      SearchForm
    },
    data() {
      return {
        opt: 'recycle',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        tableLabel: [{
            prop: 'uid',
            label: 'ID',
            sort: true
          },
          {
            prop: 'username',
            label: '用户名',
            sort: true
          },
          {
            prop: 'sex',
            label: '性别'
          },
          {
            prop: 'birth',
            label: '出生日期',
            width: 130,
            sort: true
          },
          {
            prop: 'email',
            label: '邮箱',
            width: 160
          },
          {
            prop: 'phone',
            label: '手机号',
            width: 160
          },
          {
            prop: 'identity',
            label: '身份类型',
            width: 130,
            sort: true
          }
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        formOptions: [{
            label: '用户名',
            prop: 'username',
            element: 'el-input'
          },
          {
            label: '性别',
            prop: 'sex',
            element: 'el-select',
            options: [{
              label: '男',
              value: 0
            }, {
              label: '女',
              value: 1
            }]
          },
          {
            label: '身份类型',
            prop: 'identity',
            element: 'el-select',
            options: [{
              label: '普通用户',
              value: 0
            }, {
              label: '教练',
              value: 1
            }, {
              label: '管理员',
              value: 2
            }]
          },
        ],
        multipleSelection: [],
        searchList: [],
      }
    },
    methods: {
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 搜索
      onSearch(val) {
        this.searchList = val
        // console.log(val)
        if (this.searchList.sex == 0) {
          this.searchList.sex = '男'
        } else if (this.searchList.sex == 1) {
          this.searchList.sex = '女'
        }

        if (this.searchList.identity == 0) {
          this.searchList.identity = '普通用户'
        } else if (this.searchList.identity == 1) {
          this.searchList.identity = '教练'
        } else if (this.searchList.identity == 2) {
          this.searchList.identity = '管理员'
        }

        this.searchTableData = this.oldData.filter(item => {
          return item.username.match(this.searchList.username) && item.sex.match(this.searchList.sex) && item
            .identity.match(this.searchList.identity)
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
      // 初始数据
      getList(page) {
        this.config.loading = true
        re_user.recycleList().then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
          })
          .catch(() => {
            this.config.loading = false
            this.oldData = []
            this.tableData = []
            this.filterTableData = []
          })
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
      // 切分数组
      spArr(arr, num) {
        let newArr = []
        for (let i = 0; i < arr.length;) {
          newArr.push(arr.slice(i, i += num));
        }
        return newArr
      },
      // 恢复数据
      recycleUser(row) {
        console.log("Recycle")
        this.$confirm('此操作将恢复此用户的账号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_user.recycleUser(row.uid).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '恢复成功!'
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
      // 恢复数据（批量）
      recycleMore(row) {
        console.log("RecycleMore")
        var recycleList = []
        this.multipleSelection.forEach(item => {
          recycleList.push(item.uid)
        })
        this.$confirm('此操作将恢复所选的用户的账号, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_user.recycleMore(recycleList).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '恢复成功!'
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
      // 删除用户
      delUser(row) {
        console.log("DEL")
        this.$confirm('此操作将永久删除此用户, 不可恢复, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_user.deleteForever(row.uid).then(res => {
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
      }
    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>

</style>
