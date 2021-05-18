<template>
  <div style="padding: 30px;">
    <el-dialog :title="operateType === 'add' ? '新增视频' : '更新视频'" :visible.sync="isShow" @close="cancel">
      <Form :formLabel="operateFormLabel" :form="operateForm" ref="form" :videoForm="videoForm" :rules="rules"></Form>
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
      @del="del" :opt="opt" @changeTableSort="changeTableSort"></Table>
  </div>
</template>

<script>
  import Form from '../../components/content/form/Form.vue'
  import Table from '../../components/content/Table.vue'
  import SearchForm from "../../components/content/SearchForm.vue";
  import * as re_course from '../../network/manage/course_list_child.js'
  import {
    durationDeal
  } from '../../assets/js/normal.js'
  export default {
    name: 'Course_List_Child',
    components: {
      Table,
      Form,
      SearchForm
    },
    data() {
      return {
        data: [],
        operateType: 'add',
        opt: 'normal',
        oldData: [], // 后端原数据
        tableData: [], // 切分后的数据组
        filterTableData: [], // 筛选后的数据(分页)
        searchTableData: [], // 筛选后的数据(搜索)
        sortTableData: [], // 筛选后的数据(排序)
        isSort: false, // 是否排序
        isSearch: false, // 是否搜索
        searchList: [],

        content: [],
        isShow: false,
        videoForm: {
          path: '',
          videoFlag: false,
          id: 1,
          length: 0
        },
        nextID: 0,
        tableLabel: [{
            prop: 'course_id',
            label: 'ID',
            sort: true,
            width: 80
          },
          {
            prop: 'group_name',
            label: '所属课程',
            width: 250
          },
          {
            prop: 'chapter',
            label: '章节名称',
            width: 150
          },
          {
            prop: 'course_name',
            label: '视频名称',
            sort: true,
            width: 250
          },
          {
            prop: 'time',
            label: '视频时长',
            width: 80
          }
        ],
        config: {
          page: 1,
          total: 10,
          loading: false
        },
        operateForm: {
          course_id: '',
          group_name: '',
          chapter: '',
          course_name: '',
          content: '',
          time: ''
        },
        operateFormLabel: [{
            model: 'course_id',
            label: '视频ID',
            type: 'input',
            show: false,
            disabled: true
          },
          {
            model: 'group_name',
            label: '所属课程',
            type: 'input',
            show: true,
            disabled: true
          },
          {
            model: 'chapter',
            label: '章节名称',
            type: 'input',
            show: true
          },
          {
            model: 'course_name',
            label: '视频名称',
            type: 'input',
            show: true
          },
          {
            model: 'content',
            label: '视频内容',
            type: 'uploadVideo',
            show: true,
            url: 'http://www.train.com/index.php/index/course/uploadVideo'
          },
          {
            model: 'time',
            label: '视频时长',
            type: 'input',
            show: false
          },
        ],
        formOptions: [{
            label: '章节名',
            prop: 'chapter',
            element: 'el-input'
          },
          {
            label: '视频名称',
            prop: 'course_name',
            element: 'el-input'
          }
        ],
        rules: {
          chapter: [{
            required: true,
            message: "请输入章节名",
            trigger: 'blur'
          }],
          course_name: [{
            required: true,
            message: "请输入视频名称",
            trigger: 'blur'
          }],
          // content: [{
          //   required: true,
          //   message: '请选择一个视频',
          //   trigger: ['blur', 'change']
          // }],
        },
      }
    },
    methods: {
      // 搜索
      onSearch(val) {
        console.log(val)
        this.searchList = val

        this.searchTableData = this.oldData.filter(item => {
          return item.chapter.match(this.searchList.chapter) &&
            item.course_name.match(this.searchList.course_name)
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
        re_course.getCourseChild(this.data.group_id).then(res => {
            console.log(res.data)
            this.oldData = res.data.data.list
            this.timeDeal()
            this.tableData = this.oldData
            this.tableData = this.spArr(this.tableData, 10)
            this.filterTableData = this.tableData[this.config.page - 1]

            this.config.total = res.data.data.count
            this.config.loading = false
            this.nextID = res.data.data.next_id
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
        this.operateForm.id = this.nextID
        this.operateForm.group_name = this.data.group_name
        this.operateType = 'add'
        this.isShow = true
        this.videoForm.id = this.operateForm.id
        this.videoForm.path = this.operateForm.content
      },
      // 编辑
      edit(row) {
        console.log("edit")
        this.operateType = 'edit'
        this.isShow = true
        this.operateForm = row
        this.videoForm.id = this.operateForm.id
        this.filterTableData.forEach(item => {
          if (item.course_id === row.course_id && item.course_content) {
            this.operateForm.content = 'http://www.train.com/' + item.course_content
          }
        })
        this.videoForm.path = this.operateForm.content // 表单显示视频
      },
      confirm() {
        this.$refs.form.getLength() // 获取视频时长
        this.$refs.form.$children[0].validate((valid) => {
          if (valid) {
            if (this.operateType === 'edit') {
              console.log("edit")
              this.$refs.form.form.content = this.videoForm.path
              this.$refs.form.form.time = this.videoForm.length
              re_course.editCourseChild(this.$refs.form.form).then(res => {
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
              this.$refs.form.form.time = this.videoForm.length
              this.$refs.form.form.content = this.videoForm.path
              re_course.addCourseChild(this.$refs.form.form).then(res => {
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
        this.getList()
      },
      del(row) {
        console.log("DEL")
        this.$confirm('此操作将删除此课程, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            re_course.deleteCourseChild(row.course_id, this.data.group_id).then(res => {
              console.log(res.data)
              if (res.data.error_code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.getList()
              } else {
                this.$message({
                  type: 'error',
                  message: '删除数据错误'
                })
              }

            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      timeDeal() {
        durationDeal(this.oldData)
      },
    },
    created() {
      if (this.$route.params.data) {
        this.data = this.$route.params.data
      }
      console.log(this.data)
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .el-table__body {
    font-size: 13px !important;
  }
</style>
