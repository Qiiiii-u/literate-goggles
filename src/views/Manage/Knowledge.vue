<template>
  <div style="padding: 30px;">
    <el-dialog :title="operateType === 'add' ? '新增百科' : '更新百科'" :visible.sync="isShow" @close="cancel">
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :rules="rules"></Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="add">+ 新增</el-button>
        <el-button size="small" type="danger" @click="deleteMore">批量删除</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" @edit="edit"
      :opt="'normal'" @del="del" @handleSelectionChange="handleSelectionChange"></Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_know from '../../network/manage/knowledge.js'

  export default {
    name: "Knowledge",
    components: {
      Table,
      Form,
      SearchForm
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],

        operateType: 'add',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        searchList: [],
        multipleSelection: [],

        isShow: false,
        nextID: 0,
        tableLabel: [{
            prop: 'knowledge_id',
            label: 'ID',
            sort: true,
            width: 80
          },
          {
            prop: 'title',
            label: '标题',
            sort: true,
            width: 350,
            link: true
          },
          {
            prop: 'author',
            label: '作者',
            sort: true,
            width: 120
          },
          {
            prop: 'type',
            label: '类型',
            sort: true,
            width: 120
          },
          {
            prop: 'time',
            label: '发布日期',
            sort: true,
            width: 200
          },
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          id: '',
          title: '',
          author: '',
          type: '',
          time: '',
          content: ''
        },
        operateFormLabel: [{
            model: 'knowledge_id',
            label: 'ID',
            type: 'input',
            show: false
          },
          {
            model: 'title',
            label: '标题',
            type: 'input',
            show: true
          },
          {
            model: 'author',
            label: '作者',
            type: 'input',
            show: true
          },
          {
            model: 'type',
            label: '类型',
            type: 'input',
            show: true,
          },
          {
            model: 'time',
            label: '发布时间',
            type: 'date',
            show: false
          },
          {
            model: 'content',
            label: '文章内容',
            type: 'content',
            show: true
          },
        ],
        formOptions: [{
            label: '标题',
            prop: 'title',
            element: 'el-input'
          },
          {
            label: '作者',
            prop: 'author',
            element: 'el-input'
          },
          {
            label: '类型',
            prop: 'type',
            element: 'el-input'
          },
        ],
        rules: {
          title: [{
            required: true,
            message: "请输入标题",
            trigger: 'blur'
          }],
          author: [{
            required: true,
            message: "请输入作者",
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: '请输入文章类型',
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: '请输入文章内容',
            trigger: 'blur'
          }],
        },
      }
    },
    methods: {
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val

        this.searchTableData = this.oldData.filter(item => {
          return item.title.match(this.searchList.title) && item.author.match(this.searchList.author) && item.type
            .match(this.searchList.type)
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
      // 初始化数据
      getList() {
        this.config.loading = true
        re_know.getKnowledgeList(this.userInfoList.uid).then(res => {
          console.log(res.data)
          if (res.data.error_code == 0) {
            this.oldData = res.data.data.list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
            this.nextID = res.data.data.nextID
          } else {
            this.config.loading = false
            this.oldData = []
            this.tableData = []
            this.filterTableData = []
          }

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
      add() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.knowledge_id = this.nextID
        this.operateType = 'add'
        this.isShow = true
        if (this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练') {
          this.operateForm.author = this.userInfoList.username
          this.operateFormLabel.forEach(item => {
            if (item.model == 'author') {
              item.disabled = true
            }
          })
        }
      },
      edit(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
      },
      confirm() {
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'edit') {
              console.log("edit")
              re_know.editKnowledge(this.$refs.form.form).then(res => {
                console.log(res.data)
                if (res.data.error_code == 0) {
                  this.isShow = false
                  this.$message({
                    type: 'success',
                    message: '成功更新数据'
                  })
                  this.$refs.form.$children[0].resetFields()
                } else {
                  this.$message({
                    type: 'error',
                    message: '更新数据错误'
                  })
                }
              })
            } else {
              console.log("add")
              re_know.addKnowledge(this.$refs.form.form).then(res => {
                console.log(res.data)
                if (res.data.error_code == 0) {
                  this.isShow = false
                  this.$message({
                    type: 'success',
                    message: '成功添加数据'
                  })
                  this.$refs.form.$children[0].resetFields()
                } else {
                  this.$message({
                    type: 'error',
                    message: '添加数据错误'
                  })
                }
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      del(row) {
        console.log("DEL")
        // console.log(row.knowledge_id)
        this.$confirm('此操作将删除此百科, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_know.delKnowledge(row.knowledge_id).then(res => {
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
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 批量删除
      deleteMore() {
        console.log("DELMORE")
        var deleteList = []
        this.multipleSelection.forEach(item => {
          deleteList.push(item.knowledge_id)
        })
        this.$confirm('此操作将批量删除百科, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_know.deleteMore(deleteList).then(res => {
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
      cancel() {
        this.$refs.form.$children[0].resetFields()
        this.getList()
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table__body,
  ::v-deep .el-link {
    font-size: 13px !important;
  }

  ::v-deep .el-link.el-link--default:hover {
    color: #2d8cf0;
  }

  ::v-deep .ql-container.ql-snow {
    height: 150px;
  }
</style>
