<template>
  <div>
    <el-card class="box-card">
      <!-- tabs -->
      <el-tabs @tab-click="handleClick" value="first">
        <el-tab-pane label="全部" name="first">
          <coach-course-item :data="courselistfilter"></coach-course-item>
        </el-tab-pane>
        <el-tab-pane label="实体课" name="second">
          <coach-course-item :data="courselistfilter"></coach-course-item>
        </el-tab-pane>
        <el-tab-pane label="网课" name="third">
          <coach-course-item :data="courselistfilter"></coach-course-item>
        </el-tab-pane>
      </el-tabs>
      <!-- end tabs -->

    </el-card>
    <el-card class="box-card" style="margin-top: 10px;">
      <div class="text item">
        <p class="nulltips" style="padding: 0;">若要对课程进行操作，请前往<a style="color: lightcoral;cursor: pointer;"
            @click="toManage">后台管理系统</a>
        </p>
      </div>
    </el-card>
  </div>
</template>

<script>
  import {
    deal
  } from '../../assets/js/normal.js'
  import * as re_course from '../../network/mine/course.js'
  import CoachCourseItem from '../../components/content/CoachCourseItem.vue'
  export default {
    name: 'Coach_Course',
    components: {
      CoachCourseItem
    },
    data() {
      return {
        user: '',
        is_login: false,
        userInfoList: [],
        // 后端数据
        courselistAll: [],
        courselistfilter: []
      }
    },
    methods: {
      toManage() {
        this.$router.push('/Manage/Home')
      },
      // tabs切换事件
      handleClick(tab, event) {
        if (tab.name == 'first') {
          this.courselistfilter = JSON.parse(JSON.stringify(this.courselistAll))
        } else if (tab.name == 'second') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.type === '线下课程'
          })
        } else if (tab.name == 'third') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.type === '线上课程'
          })
        }
      },
      // 获取课程列表数据
      getList() {
        re_course.getCoachCourse(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.courselistAll = res.data.data.list
            deal(this.courselistAll)
            this.courselistfilter = JSON.parse(JSON.stringify(this.courselistAll))
          } else {
            this.courselistAll = []
          }

        })
      },
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
    },
  }
</script>

<style lang="scss" scoped>
  //tabs
  ::v-deep .el-tabs__active-bar {
    background-color: rgba(240, 20, 20, .6);
  }

  ::v-deep .el-tabs__item.is-active,
  ::v-deep .el-tabs__item:hover {
    color: lightcoral;
  }

  // end tabs

  // data is null tips
  .nulltips {
    padding: 100px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }

  // end tips
</style>
