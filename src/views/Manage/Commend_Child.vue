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
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" :opt="opt"
      @del="del" @handleSelectionChange="handleSelectionChange" @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_commend from '../../network/manage/commend_child.js'
  export default {
    name: 'Commend_Child',
    components: {
      Table,
      SearchForm
    },
    data() {
      return {
        opt: 'review',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索
        tableLabel: [{
            prop: 'id',
            label: 'ID',
            sort: true
          },
          {
            prop: 'author',
            label: '评论人',
            sort: true,
            width: 150
          },
          {
            prop: 'content',
            label: '评论内容',
            sort: true,
            width: 250
          },
          {
            prop: 'username',
            label: '回复人',
            sort: true,
            width: 100
          },
          {
            prop: 'current_content',
            label: '回复内容',
            width: 250
          },
          {
            prop: 'time',
            label: '回复时间',
            sort: true,
            width: 180
          },
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
            label: '评论内容',
            prop: 'content',
            element: 'el-input'
          },
          // {label: '评论时间', prop: 'time', element: 'el-date-picker', type: 'daterange'}
        ],
        multipleSelection: [],
        searchList: [],
      }
    },
    methods: {
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val
        this.searchTableData = this.oldData.filter(item => {
          return item.username.match(this.searchList.username) && item.content.match(this.searchList.content)
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
      getList() {
        this.config.loading = true
        re_commend.getCommendChild().then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
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
        this.$confirm('此操作将批量永久删除所选评论, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_commend.deleteMoreCommendChild(deleteList).then(res => {
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
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此评论, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_commend.delCommendChild(row.id).then(res => {
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
</style>
