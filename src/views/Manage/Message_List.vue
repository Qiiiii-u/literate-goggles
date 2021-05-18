<template>
  <div style="padding: 30px;">
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="add">+ 新增</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <el-dialog title="新建通知" :visible.sync="isShowAdd" @close="cancel">
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :rules="rules"></Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShowAdd = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-tabs @tab-click="handleClick" value="first">
      <el-tab-pane label="全部通知" name="first">
        <div>
          <el-dialog title="查看通知" :visible.sync="isScan" @close="cancel">
            <el-form inline class="demo-table-expand">
              <el-form-item label="标题">
                <span>{{ scanList.title }}</span>
              </el-form-item>
              <el-form-item label="类型">
                <span>{{ scanList.type }}</span>
              </el-form-item>
              <el-form-item label="管理员">
                <span>{{ scanList.username }}</span>
              </el-form-item>
              <el-form-item label="内容">
                <div v-html="scanList.content"></div>
              </el-form-item>
            </el-form>
          </el-dialog>
          <Table :tableData="filterTableData" :tableLabel="tableLabelAll" :config="configAll" @changePage="getListAll"
            :opt="'scan'" @scan="scan" @handleSelectionChange="handleSelectionChange"
            @changeTableSort="changeTableSort"></Table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="已发布" name="second">
        <div>
          <Table :tableData="filterTableData" :tableLabel="tableLabelAll" :config="configAll" @changePage="getListAll"
            @del="del" :opt="'review'" @changeTableSort="changeTableSort"></Table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="未发布" name="third">
        <div>
          <el-dialog title="修改通知" :visible.sync="isShow" @close="cancel">
            <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :rules="rules"></Form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="isShow = false">取 消</el-button>
              <el-button type="primary" @click="confirm">确 定</el-button>
            </div>
          </el-dialog>
          <Table :tableData="filterTableData" :tableLabel="tableLabelAll" :config="configAll" @changePage="getListAll"
            @edit="edit" @del="del" @publish="publish" :opt="'publish'" @changeTableSort="changeTableSort"></Table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="回收站" name="fourth">
        <div>
          <Table :tableData="filterTableData" :tableLabel="tableLabelAll" :config="configAll" @changePage="getListAll"
            @recycle="recycle" @del="delforever" :opt="'recycle'" @changeTableSort="changeTableSort"></Table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_mess from '../../network/manage/message_list.js'
  export default {
    name: "Message_List",
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

        isScan: false,
        scanList: [],

        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        operateType: 'add',
        status: 3,
        isShow: false,
        isShowAdd: false,
        content: [],
        nextID: 0,
        tableLabelAll: [{
            prop: 'id',
            label: 'ID',
            sort: true,
            width: 80
          },
          {
            prop: 'title',
            label: '标题',
            sort: true,
            width: 300,
            link: true
          },
          {
            prop: 'username',
            label: '管理员',
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
            prop: 'status',
            label: '状态',
            sort: true,
            width: 120,
            tag: true
          },
          {
            prop: 'time',
            label: '日期',
            sort: true,
            width: 200
          },
        ],
        configAll: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          id: '',
          title: '',
          username: '',
          type: '',
          time: '',
          content: ''
        },
        operateFormLabel: [{
            model: 'id',
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
            model: 'username',
            label: '管理员',
            type: 'input',
            show: false
          },
          {
            model: 'type',
            label: '类型',
            type: 'select',
            show: true,
            opts: [{
              label: '系统通知',
              value: 0
            }, {
              label: '公告消息',
              value: 1
            }, {
              label: '活动消息',
              value: 2
            }, {
              label: '其他通知',
              value: 3
            }]
          },
          {
            model: 'time',
            label: '时间',
            type: 'date',
            show: false
          },
          {
            model: 'content',
            label: '通知内容',
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
            label: '管理员',
            prop: 'username',
            element: 'el-input'
          },
          {
            label: '类型',
            prop: 'type',
            element: 'el-select',
            options: [{
              label: '系统通知',
              value: 0
            }, {
              label: '公告消息',
              value: 1
            }, {
              label: '活动消息',
              value: 2
            }, {
              label: '其他通知',
              value: 3
            }]
          }
        ],
        multipleSelection: [],
        rules: {
          title: [{
            required: true,
            message: "请输入标题",
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: "请选择类型",
            trigger: 'blur'
          }],
          content: [{
            required: true,
            message: "请输入内容",
            trigger: 'blur'
          }]
        },
      }
    },
    methods: {
      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val
        this.searchTableData = this.oldData.filter(item => {
          return item.title.match(this.searchList.title) && item.username.match(this.searchList.username) && item
            .type.match(this.searchList.type)
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
      // tab
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.status = 3
        } else if (tab.name === 'second') {
          this.status = 1
        } else if (tab.name === 'third') {
          this.status = 0
        } else if (tab.name === 'fourth') {
          this.status = 2
        }
        this.getListAll()
      },
      // 初始化
      getListAll() {
        this.configAll.loading = true
        re_mess.getMessageList(this.status).then(res => {
            console.log(res.data)
            if (res.data.error_code == 0) {
              this.oldData = res.data.data.list
              this.tableData = this.oldData
              this.tableData = this.spArr(this.tableData, 10)
              this.filterTableData = this.tableData[this.configAll.page - 1]

              this.configAll.total = res.data.data.count
              this.configAll.loading = false
              this.nextID = res.data.data.nextID
            } else {
              this.configAll.loading = false
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
            this.configAll.loading = false
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
      // 删除
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此通知, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_mess.delMessage(row.id).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '删除成功!（可在回收站一栏查看）'
              })
              this.getListAll()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 恢复
      recycle(row) {
        console.log("Recycle")
        this.$confirm('此操作将恢复此通知, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_mess.recycleMessage(row.id).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '恢复成功!(在未发布一栏可查看)'
              })
              this.getListAll()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消恢复'
            })
          })
      },
      // 发布
      publish(row) {
        console.log("Recycle")
        this.$confirm('此操作将发布此通知, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_mess.publishMessage(row.id).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.getListAll()
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消发布'
            })
          })
      },
      add() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.id = this.nextID
        this.operateForm.username = this.userInfoList.username
        this.operateType = 'add'
        this.isShowAdd = true
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
              re_mess.editMessage(this.$refs.form.form).then(res => {
                console.log(res.data)
                this.isShow = false
                this.$message({
                  type: 'success',
                  message: '修改成功！'
                })
              })
            } else {
              console.log("add")
              re_mess.addMessage(this.$refs.form.form).then(res => {
                console.log(res.data)
                this.isShowAdd = false
                this.$message({
                  type: 'success',
                  message: '增加成功!(在未发布一栏可查看)'
                })
              })

            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      cancel() {
        this.$refs.form.$children[0].resetFields()
        this.getListAll()
      },
      // 查看
      scan(row) {
        console.log('scan')
        this.scanList = row
        this.isScan = true

      },
      // 永久删除
      delforever(row) {
        console.log('forever')
        this.$confirm('此操作将永久删除此通知, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_mess.delForeverMessage(row.id).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getListAll()
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
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getListAll()
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

  ::v-deep .common-table .pager {
    position: relative;
  }

  ::v-deep .ql-container.ql-snow {
    height: 150px;
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
