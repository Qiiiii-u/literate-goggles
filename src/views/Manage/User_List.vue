<template>
  <div style="padding: 30px;">
    <el-dialog :title="operateType === 'add' ? '新增用户' : '更新用户'" :visible.sync="isShow" @close="cancel">
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :rules="rules">
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="addUser">+ 新增</el-button>
        <el-button size="small" type="danger" @click="deleteMore">批量删除</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset"/>
      </el-col>
    </el-row>
    <!--tableData: 表格  tableLabel:表格标签  config:分页  changePage:列表  edit:更新  del:删除-->
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData"
      @edit="editUser" @del="delUser" @handleSelectionChange="handleSelectionChange" @use="handleUse" @changeTableSort="changeTableSort">
    </Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_user from '../../network/manage/user_list.js'
  export default {
    name: "User_List",
    components: {
      Form,
      Table,
      SearchForm
    },
    data() {
      // 手机验证方法
      const checkPhone = (rule, value, callback) => {
        if (value === '' || typeof(value) === 'undefined' || value === null) {
          callback()
        }
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的手机号'));
        }
      }
      return {
        operateType: 'add',
        nextID: 0,
        isShow: false, // dialog显示
        // opt: 'normal', // 操作按钮
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        // pageNum: 1, // 分页共几页
        // totalPage: [], // 所有页面的数据
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
          },
          {
            prop: 'status',
            label: '状态',
            stop: true,
            sort: true
          }
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          uid: '',
          username: '',
          sex: '',
          birth: '',
          email: '',
          phone: '',
          identity: '',
        },
        operateFormLabel: [{
            model: 'uid',
            label: 'ID',
            type: 'input',
            disabled: true,
            show: true
          },
          {
            model: 'username',
            label: '姓名',
            type: 'input',
            show: true
          },
          {
            model: 'sex',
            label: '性别',
            type: 'select',
            show: true,
            opts: [{
              label: '男',
              value: 0
            }, {
              label: '女',
              value: 1
            }]
          },
          {
            model: 'birth',
            label: '出生日期',
            type: 'date',
            show: true
          },
          {
            model: 'email',
            label: '邮箱',
            type: 'input',
            show: true
          },
          {
            model: 'phone',
            label: '手机号',
            type: 'input',
            show: true
          },
          {
            model: 'identity',
            label: '身份类型',
            type: 'select',
            show: true,
            opts: [{
                label: '普通用户',
                value: 0
              },
              {
                label: '教练',
                value: 1
              },
              {
                label: '管理员',
                value: 2
              }
            ]
          },
        ],
        rules: {
          uid: [{
            required: true,
            message: "请输入ID",
            trigger: 'blur'
          }],
          username: [{
              required: true,
              message: "请输入用户名",
              trigger: 'blur'
            },
            {
              min: 2,
              max: 30,
              message: "长度在 2 到 30 个字符",
              trigger: 'blur'
            }
          ],
          sex: [{
            required: true,
            message: "请选择性别",
            trigger: 'blur'
          }],
          birth: [{
            message: "请输入出生日期",
            trigger: 'blur'
          }],
          email: [{
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: 'blur'
          }],
          phone: [{
            validator: checkPhone,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }],
          identity: [{
            required: true,
            message: "请选择身份类型",
            trigger: 'blur'
          }],
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
          }
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
      // 启用账号
      handleUse(row) {
        re_user.changeUserStatus(row.uid).then(res => {
          // console.log(res.data)
          this.getList(this.config.page)
        })
      },
      // 批量删除
      deleteMore() {
        console.log("DELMORE")
        var deleteList = []
        this.multipleSelection.forEach(item => {
          deleteList.push(item.uid)
        })
        this.$confirm('此操作将删除所选用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_user.deleteMore(deleteList).then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getList(this.config.page)
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      // 搜索 模糊
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
      onReset(){
        this.filterTableData = this.tableData[0]
        this.isSearch = false
        this.config.page = 1
      },
      // 初始化数据
      getList() {
        this.config.loading = true
        re_user.getList()
          .then(res => {
            this.oldData = res.data.data.u_list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.nextID = res.data.data.next_id
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
        if(this.isSort){ // 已排序调用排序的数据
          this.filterTableData = this.sortTableData[page - 1]
        }else if(this.isSearch){
          this.filterTableData = this.searchTableData[page - 1]
        }else{
          this.filterTableData = this.tableData[page - 1]
        }
      },
      // 排序
      changeTableSort(val){
        // console.log(val)
        this.config.page = 1
        if(val.order == null){ // 未排序
          this.isSort = false
          this.filterTableData = this.tableData[this.config.page - 1]
        }else{ // 正倒序
          this.sortTableData = this.spArr(this.oldData.sort(this.sortTable(val.prop, val.order == "ascending")), 10)
          this.filterTableData = this.sortTableData[this.config.page - 1]
          this.isSort = true
        }
      },
      sortTable(col, rev){
        if(rev == undefined){
          rev = 1
        }else{
          rev = (rev) ? 1 : -1
        }

        return function(a, b) {
          a = a[col]
          b = b[col]
          if(a < b) {
            return rev * -1
          }
          if(a > b) {
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
      // 添加用户
      addUser() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.uid = this.nextID
        this.operateType = 'add'
        this.isShow = true
      },
      // 编辑用户
      editUser(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
      },
      confirm() {
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'edit') {
              console.log("editUser")
              re_user.editUser(this.$refs.form.form).then(res => {
                console.log(res.data)
                this.isShow = false
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                })
                this.$refs.form.$children[0].resetFields()
              })

            } else {
              console.log("addUser")
              console.log(this.$refs.form.form);
              re_user.addUser(this.$refs.form.form).then(res => {
                console.log(res.data)
                this.isShow = false
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
                this.$refs.form.$children[0].resetFields()
              })
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      // 取消表单
      cancel() {
        // 重置表单
        this.$refs.form.$children[0].resetFields()
        this.getList()
      },
      // 删除用户
      delUser(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_user.deleteUser(row.uid).then(res => {
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

</style>
