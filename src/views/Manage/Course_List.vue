<template>
  <div style="padding: 30px;">
    <el-dialog :title="operateType === 'add' ? '新增课程' : '更新课程'" :visible.sync="isShow" @close="cancel"
      :modal-append-to-body='false'>
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :imgForm="imgForm"
        :checkbox_list="checkbox_list" @handleCheckBoxChange="handleCheckBoxChange" :rules="rules"
        @selectChange="selectChange"></Form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <el-row style="margin-bottom: 10px;">
      <el-col :xs="24" :sm="24" :md="24" :lg="3" :xl="3" style="margin: 8px 0;">
        <el-button size="small" type="primary" @click="add">+ 新增</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="21" :xl="21">
        <SearchForm :formOptions="formOptions" @onSearch="onSearch" @onReset="onReset" />
      </el-col>
    </el-row>
    <Table :tableData="filterTableData" :tableLabel="tableLabel" :config="config" @changePage="showData" @edit="edit"
      @del="del" :opt="opt" @toContent="toContent" @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_course from '../../network/manage/course_list.js'
  export default {
    name: "Course_List",
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
        opt: 'normal',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索

        content: [],
        isShow: false,
        searchList: [],
        coach_list: [],

        videoForm: {
          path: '',
          videoFlag: false,
          id: 1
        },
        imgForm: {
          url: '',
          imgFlag: false,
          id: 1,
          dialogVisible: false
        },
        checkbox_list: ['基础运动', '障碍运动', '球类', '其他运动'],
        nextID: 0,
        tableLabel: [{
            prop: 'group_id',
            label: 'ID',
            sort: true,
            width: 80
          },
          {
            prop: 'group_name',
            label: '课程名称',
            sort: true,
            width: 200,
            link: true
          },
          {
            prop: 'type',
            label: '课程类型',
            width: 100,
            tag: true
          },
          {
            prop: 'price',
            label: '价格/元',
            sort: true,
            width: 100
          },
          {
            prop: 'username',
            label: '授课老师',
            width: 100
          },
          {
            prop: 'tagLabel',
            label: '课程标签',
            width: 240,
            taglabel: true
          },
          {
            prop: 'participants_num',
            label: '参与人数',
            width: 80
          }
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          group_id: '',
          group_name: '',
          type: '',
          price: 0,
          username: '',
          introduction: '',
          img: '',
          tagLabel: []
        },
        operateFormLabel: [{
            model: 'group_id',
            label: '课程ID',
            type: 'input',
            show: false,
            disabled: true,
          },
          {
            model: 'group_name',
            label: '课程名称',
            type: 'input',
            show: true
          },
          {
            model: 'type',
            label: '课程类型',
            type: 'select',
            show: true,
            opts: [{
              label: '线上课程',
              value: 0
            }, {
              label: '线下课程',
              value: 1
            }]
          },
          {
            model: 'price',
            label: '价格',
            type: 'number',
            show: true
          },
          {
            model: 'username',
            label: '授课老师',
            type: 'select',
            opts: [],
            show: true
          },
          {
            model: 'introduction',
            label: '课程介绍',
            type: 'content',
            show: true
          },
          {
            model: 'img',
            label: '课程封面',
            type: 'uploadImg',
            show: true,
            url: 'http://www.train.com/index.php/index/course/uploadImg'
          },
          {
            model: 'tagLabel',
            label: '课程标签',
            type: 'checkbox',
            show: true
          },
        ],
        formOptions: [{
            label: '课程',
            prop: 'group_name',
            element: 'el-input'
          },
          {
            label: '类型',
            prop: 'type',
            element: 'el-select',
            options: [{
              label: '线上课程',
              value: 0
            }, {
              label: '线下课程',
              value: 1
            }]
          }
        ],
        rules: {
          group_name: [{
            required: true,
            message: "请选择课程",
            trigger: 'blur'
          }],
          type: [{
            required: true,
            message: "请选择类型",
            trigger: 'blur'
          }],
          price: [{
            required: true,
            message: "请输入价格",
            trigger: 'blur'
          }],
          username: [{
            required: true,
            message: '请选择一名教练',
            trigger: 'blur'
          }],
          tagLabel: [{
            required: true,
            message: '请选择一个标签',
            trigger: 'blur'
          }],
          introduction: [{
            required: true,
            message: '请输入课程介绍',
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
        // console.log(val)
        if (this.searchList.type == 0) {
          this.searchList.type = '线上课程'
        } else if (this.searchList.type == 1) {
          this.searchList.type = '线下课程'
        }

        this.searchTableData = this.oldData.filter(item => {
          return item.type.match(this.searchList.type) && item.group_name.match(this.searchList.group_name)
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
      // 复选框
      handleCheckBoxChange(val) {
        console.log(this.operateForm.tagLabel)
      },
      // 获取教练数据
      getCoachList() {
        console.log(this.userInfoList.identity);
        if (this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练') {

          this.coach_list[0] = this.userInfoList
          this.coach_list.forEach(item => {
            item.label = item.username
            item.value = item.uid
          })
          this.operateFormLabel.forEach(item => {
            if (item.model == 'username') {
              item.opts = this.coach_list
            }
          })
        } else if (this.userInfoList.identity == 'admin' || this.userInfoList.identity == '管理员') {
          re_course.getAllCoach().then(res => {
              console.log(res.data)
              this.coach_list = res.data.data.list
              this.coach_list.forEach(item => {
                item.label = item.username
                item.value = item.uid
              })
              this.operateFormLabel.forEach(item => {
                if (item.model == 'username') {
                  item.opts = this.coach_list
                }
              })
            })
            .catch(() => {
              this.coach_list = []
            })
        }
      },
      // 初始化数据
      getList() {
        this.config.loading = true
        re_course.getCourseList(this.userInfoList.uid).then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
            this.nextID = res.data.data.next_id
            this.getCoachList()
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
      // 添加
      add() {
        console.log("Add")
        this.operateForm = {}
        this.operateForm.tagLabel = []
        this.operateForm.group_id = this.nextID
        this.operateType = 'add'
        this.isShow = true
        this.imgForm.group_id = this.operateForm.group_id
        this.imgForm.url = this.operateForm.img
        // console.log(this.operateForm)
      },
      // 编辑
      edit(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
        this.imgForm.group_id = this.operateForm.group_id
        this.filterTableData.forEach(item => {
          if (item.group_id === row.group_id && item.img) {
            this.operateForm.img = 'http://www.train.com/' + item.img
          }
          if (item.group_id === row.group_id) {
            this.operateForm.tagLabel = item.tagLabel
          }
        })
        this.imgForm.url = this.operateForm.img
        this.getCoachList()
      },
      selectChange(selectValue) {
        // console.log(selectValue)
        this.operateForm.coach_id = selectValue
      },
      confirm() {
        // console.log(this.$refs.form.form);
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'edit') {
              console.log("edit")
              this.$refs.form.form.content = this.imgForm.url
              re_course.editCourseGroup(this.$refs.form.form).then(res => {
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
              this.$refs.form.form.content = this.imgForm.url
              // console.log(this.$refs.form.form);
              console.log(this.$refs.form.form.username);
              re_course.addCourseGroup(this.$refs.form.form).then(res => {
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
      cancel() {
        this.$refs.form.$children[0].resetFields()
        // this.getList(this.config.page)
        this.getList()
      },
      // 删除
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将永久删除此课程组以及附属课程视频, 是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_course.deleteCourseGroup(row.group_id).then(res => {
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
      toContent(row) {
        this.$router.push({
          name: 'Course_List_Child',
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
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table__body {
    font-size: 13px !important;
  }

  ::v-deep .el-table__body,
  ::v-deep .el-link {
    font-size: 13px !important;
  }

  ::v-deep .el-link.el-link--default:hover {
    color: #2d8cf0;
  }
</style>
