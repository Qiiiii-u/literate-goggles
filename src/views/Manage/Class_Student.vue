<template>
  <div style="padding: 30px;">
    <el-dialog title="新增学生" :visible.sync="isShow" @close="cancel">
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
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" :opt="opt"
      @del="del" @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_student from '../../network/manage/class_student.js'
  export default {
    name: 'Class_Student',
    components: {
      Form,
      Table,
      SearchForm
    },
    data() {
      let self = this
      return {
        operateType: 'add',
        nextID: 0,
        isShow: false, // dialog显示
        opt: 'review',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        tableLabel: [{
            prop: 'uid',
            label: 'UID',
            sort: true,
            width: 160
          },
          {
            prop: 'username',
            label: '用户名',
            sort: true,
            width: 160
          },
          {
            prop: 'sex',
            label: '性别',
            width: 160
          },
          {
            prop: 'email',
            label: '邮箱',
            width: 200
          },
          {
            prop: 'phone',
            label: '手机号',
            width: 200
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
          // {label: '评论时间', prop: 'time', element: 'el-date-picker', type: 'daterange'}
        ],
        operateForm: {
          id: '',
          uid: '',
          username: '',
          sex: ''
        },
        operateFormLabel: [{
            prop: 'id',
            label: 'ID',
            type: 'input',
            show: false
          },
          {
            model: 'uid',
            label: 'UID',
            type: 'input',
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
          // {
          //   model: 'birth',
          //   label: '出生日期',
          //   type: 'date',
          //   show: true
          // },
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
        ],
        rules: {
          uid: [{
              required: true,
              message: "请输入UID",
              trigger: 'blur'
            },
            {
              validator: self.checkUid,
              trigger: 'blur'
            }
          ],
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
          ]
        },
        multipleSelection: [],
        searchList: [],

        data: [],
        is_login: false,
        user: '',
        userInfoList: [],
        course_list: [], // 教练所有的课程列表
        user_list: [], // 未列入该班级的学生名单
      }
    },
    methods: {
      // 用户验证规则
      checkUid(rule, value, callback) {
        if (this.user_list.includes(parseInt(value))) {
          return callback()
        } else {
          return callback(new Error('该用户尚未购买此课程'));
        }
      },
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val
        if (this.searchList.sex == 0) {
          this.searchList.sex = '男'
        } else if (this.searchList.sex == 1) {
          this.searchList.sex = '女'
        }

        this.searchTableData = this.oldData.filter(item => {
          return item.username.match(this.searchList.username) && item.sex.match(this.searchList.sex)
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
      // 初始化
      getList() {
        this.config.loading = true
        re_student.getStudents(this.data.id).then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.oldData.forEach(item => {
              if (item.email == null) {
                item.email = '无'
              }
              if (item.phone == null) {
                item.phone = '无'
              }
              if (item.sex == 0) {
                item.sex = '男'
              } else if (item.sex == 1) {
                item.sex = '女'
              } else {
                item.sex = '未知'
              }
            })
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
            this.nextID = res.data.data.next_id
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
      getUserList() {
        re_student.getUser(this.data.id, this.data.group_id).then(res => {
            console.log(res.data)
            if (res.data.error_code == 0) {
              this.user_list = res.data.data.list
              console.log(this.user_list)
            } else {
              this.user_list = []
            }
          })
          .catch(() => {
            this.user_list = []
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
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此学生, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_student.delUser(this.operateForm.id, this.data.id).then(res => {
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
      // 添加
      addUser() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.id = this.nextID
        this.operateType = 'add'
        this.isShow = true
      },
      confirm() {
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'add') {
              console.log("add")
              re_student.addUser(this.operateForm.uid, this.operateForm.id, this.data.id).then(res => {
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
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      if (this.$route.params.data) {
        this.data = this.$route.params.data
      }
      console.log(this.data)
      this.getList()
      this.getUserList()
    }
  }
</script>

<style lang="scss" scoped>

</style>
