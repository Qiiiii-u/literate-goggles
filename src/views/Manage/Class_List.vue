<template>
  <div style="padding: 30px;">
    <el-dialog :title="operateType === 'add' ? '新增班级' : '更新班级'" :visible.sync="isShow" @close="cancel">
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :rules="rules" @selectChange="selectChange">
      </Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="addClass">+ 新增</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" :opt="opt"
      @del="del" @edit="editClass" @toContent="toContent" @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_class from '../../network/manage/class_list.js'
  export default {
    name: 'Class_List',
    components: {
      Form,
      Table,
      SearchForm
    },
    data() {
      return {
        operateType: 'add',
        nextID: 0,
        isShow: false, // dialog显示
        opt: 'normal',
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
            width: 80,
            sort: true
          },
          {
            prop: 'group_name',
            label: '课程名称',
            width: 150,
            link: true
          },
          {
            prop: 'name',
            label: '班级名称',
            sort: true,
            width: 150
          },
          {
            prop: 'start_time',
            label: '开班时间',
            sort: true,
            width: 130
          },
          {
            prop: 'end_time',
            label: '结班时间',
            sort: true,
            width: 130
          },
          {
            prop: 'hour',
            label: '课时',
            sort: true,
            width: 80
          },
          {
            prop: 'count',
            label: '参与人数',
            sort: true,
            width: 120
          },
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        formOptions: [{
            label: '课程名称',
            prop: 'group_name',
            element: 'el-input'
          },
          {
            label: '班级名称',
            prop: 'name',
            element: 'el-input'
          },
          // {label: '评论时间', prop: 'time', element: 'el-date-picker', type: 'daterange'}
        ],
        operateForm: {
          id: '',
          group_name: '',
          name: '',
          start_time: '',
          end_time: '',
          hour: '',
        },
        operateFormLabel: [{
            model: 'id',
            label: 'ID',
            type: 'input',
            disabled: true,
            show: false
          },
          {
            model: 'group_name',
            label: '课程名称',
            type: 'select',
            show: true,
            opts: []
          },
          {
            model: 'name',
            label: '班级名称',
            type: 'input',
            show: true,
          },
          {
            model: 'start_time',
            label: '开班时间',
            type: 'date',
            show: true
          },
          {
            model: 'end_time',
            label: '结班时间',
            type: 'date',
            show: true
          },
          {
            model: 'hour',
            label: '课时',
            type: 'number',
            show: true,
          },

        ],
        rules: {
          group_name: [{
            required: true,
            message: "请选择课程",
            trigger: 'blur'
          }],
          name: [{
            required: true,
            message: "请输入班级名称",
            trigger: 'blur'
          }],
          start_time: [{
            required: true,
            message: "请选择开班时间",
            trigger: 'blur'
          }],
          end_time: [{
            required: true,
            message: '请选择结班时间',
            trigger: 'blur'
          }],
          hour: [{
            required: true,
            message: '请输入课时时长',
            trigger: 'blur'
          }],
        },
        multipleSelection: [],
        searchList: [],

        is_login: false,
        user: '',
        userInfoList: [],
        course_list: [], // 教练所有的课程列表
      }
    },
    methods: {
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val
        this.searchTableData = this.oldData.filter(item => {
          return item.group_name.match(this.searchList.group_name) && item.name.match(this.searchList.name)
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
        re_class.getClassInfo(this.userInfoList.uid).then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
            this.nextID = res.data.data.next_id
            // this.getCourseList()
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
      getCourseList() {
        re_class.getCourse(this.userInfoList.uid).then(res => {
            console.log(res.data)
            if (res.data.error_code == 0) {
              this.course_list = res.data.data.list
              this.course_list = this.course_list.filter(item => {
                return item.type == '线下课程'
              })
              this.course_list.forEach(item => {
                item.label = item.group_name
                item.value = item.group_id
              })
              this.operateFormLabel.forEach(item => {
                if (item.model == 'group_name') {
                  item.opts = this.course_list
                }
              })
              console.log(this.operateFormLabel)
            } else {
              this.course_list = []
            }
          })
          .catch(() => {
            this.course_list = []
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
        this.$confirm('此操作将删除此班级, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_class.delClass(row.id).then(res => {
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
      addClass() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.id = this.nextID
        this.operateType = 'add'
        this.isShow = true
      },
      // 编辑
      editClass(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
      },
      selectChange(selectValue) {
        // console.log(selectValue)
        this.operateForm.group_id = selectValue
      },
      confirm() {
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'edit') {
              console.log("edit")
              re_class.editClass(this.$refs.form.form).then(res => {
                  console.log(res.data)
                  this.isShow = false
                  this.$message({
                    type: 'success',
                    message: '修改成功!'
                  })
                  this.$refs.form.$children[0].resetFields()
                })
            } else {
              console.log("add")
              let formData = {}
              formData.uid = this.userInfoList.uid
              formData.id = this.operateForm.id
              formData.start_time = this.operateForm.start_time
              formData.end_time = this.operateForm.end_time
              formData.hour = this.operateForm.hour
              formData.name = this.operateForm.name
              formData.group_id = this.operateForm.group_id
              console.log(formData);
              re_class.addClass(formData).then(res => {
                  console.log(res.data)
                  if(res.data.error_code == 0){
                    this.isShow = false
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    })
                    this.$refs.form.$children[0].resetFields()
                  }else{
                    this.$message({
                      type: 'error',
                      message: '添加错误!'
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
      // 取消表单
      cancel() {
        // 重置表单
        this.$refs.form.$children[0].resetFields()
        this.getList()
      },
      toContent(row) {
        this.$router.push({
          name: 'Class_Student',
          params: {
            data: row
          }
        })
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
      this.getCourseList()
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
</style>
