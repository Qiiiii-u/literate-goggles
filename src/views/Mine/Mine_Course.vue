<template>
  <div>
    <el-card class="box-card">
      <!-- tabs -->
      <el-tabs @tab-click="handleClick" value="first">
        <el-tab-pane label="全部" name="first">
          <mine-course-item ref="a" :data="courselistfilter" @updateList="updateList"></mine-course-item>
        </el-tab-pane>
        <el-tab-pane label="已学习" name="second">
          <mine-course-item ref="a" :data="courselistfilter" @updateList="updateList"></mine-course-item>
        </el-tab-pane>
        <el-tab-pane label="学习中" name="third">
          <mine-course-item ref="a" :data="courselistfilter" @updateList="updateList"></mine-course-item>
        </el-tab-pane>
        <el-tab-pane label="实体课" name="fourth">
          <mine-course-item ref="a" :data="courselistfilter" @updateList="updateList"></mine-course-item>
        </el-tab-pane>
        <el-tab-pane label="网课" name="fifth">
          <mine-course-item ref="a" :data="courselistfilter" @updateList="updateList"></mine-course-item>
        </el-tab-pane>
      </el-tabs>
      <!-- end tabs -->
      <p class="card_title">推荐课程</p>
      <recommend-list></recommend-list>
    </el-card>
  </div>
</template>

<script>
  import RecommendList from '../../components/content/RecommendList.vue'
  import MineCourseItem from '../../components/content/MineCourseItem.vue'
  import * as re_course from '../../network/mine/course.js'
  export default {
    name: 'Mine_Course',
    components: {
      RecommendList,
      MineCourseItem
    },
    data() {
      return {
        // state数据
        user: '',
        is_login: false,
        userInfoList: [],
        // 后端数据
        courselistAll: [],
        courselistfilter: [],
      }
    },
    methods: {
      // tabs切换事件
      handleClick(tab, event) {
        if (tab.name == 'first') {
          this.courselistfilter = JSON.parse(JSON.stringify(this.courselistAll))
        } else if (tab.name == 'second') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.is_finished === 1
          })
        } else if (tab.name == 'third') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.is_finished === 0
          })
        } else if (tab.name == 'fourth') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.type === '线下课程'
          })
        } else if (tab.name == 'fifth') {
          this.courselistfilter = this.courselistAll.filter(course => {
            return course.type === '线上课程'
          })
        }
      },
      // 获取课程列表数据
      getList() {
        re_course.getStatusList(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.courselistAll = res.data.data.list
            this.courselistfilter = JSON.parse(JSON.stringify(this.courselistAll))
          } else {
            this.courselistAll = []
          }

        })
      },
      updateList(){
        this.getList()
      }
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
</style>
