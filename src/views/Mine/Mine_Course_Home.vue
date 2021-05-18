<template>
  <div>
    <p class="card_title">一周课程与计划</p>
    <!-- 左侧计划  右侧课程 -->
    <el-card class="box-card" style="margin-bottom: 10px;">
      <div class="text item">
        <AWeek @getSelectDate="getSelectDate"></AWeek>
        <div v-if="activities.length != 0">
          <el-timeline style="margin-top: 40px;">
            <el-timeline-item v-for="activity in activities" :timestamp="activity.timestamp" placement="top"
              :class="activity.type == 'course' ? 'course' : ''">
              <el-card>
                <div>{{activity.content}}</div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <div v-else>
          <p class="nulltips">本日无课程与计划</p>
        </div>
      </div>
    </el-card>

    <p class="card_title">最近学习</p>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <mine-course-item :data="recent_course" @updateList="updateList"></mine-course-item>
    </el-card>

    <el-card class="box-card">
      <p class="all" @click="toAllCourse">查看全部课程</p>
    </el-card>
  </div>
</template>

<script>
  import AWeek from '../../components/content/AWeek.vue'
  import MineCourseItem from '../../components/content/MineCourseItem.vue'
  import * as re_course from '../../network/mine/course.js'
  export default {
    name: 'Mine_Home',
    data() {
      return {
        // state数据
        user: '',
        is_login: false,
        userInfoList: [],

        recent_course: [],
        time: '',
        loading: true,
        activities: [],
        info: [],
      }
    },
    components: {
      AWeek,
      MineCourseItem
    },
    methods: {
      getList() {
        re_course.getStatusList(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.recent_course = res.data.data.list.filter(course => {
              return course.is_finished === 0
            })
          }
        })
      },
      getPlanTable(val) {
        re_course.getPlanTable(this.userInfoList.uid, val).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.activities = res.data.data.list
          } else {
            this.activities = []
          }
          this.getCourseTable(val)
        })
      },
      getCourseTable(val) {
        re_course.getCourseTable(this.userInfoList.uid, val).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.activities = this.activities.concat(res.data.data.list)
            this.activities.sort(function(a, b) {
              return b.timestamp < a.timestamp ? 1 : -1
            })
          }
        })
      },
      getSelectDate(val) {
        this.getPlanTable(val)
      },
      toAllCourse() {
        this.$router.push('/Mine_Course')
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
      this.getPlanTable()
    },
  }
</script>

<style lang="scss" scoped>
  // start transition
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  // end transition
  // this week statisfy
  .satis_title {
    font-size: 14px;
    color: #757c82;
    font-weight: 700;
    text-align: center;
  }

  .satis_data {
    text-align: center;
  }

  .satis_num {
    color: lightsalmon;
    font-size: 25px;
  }

  .satis_unit {
    font-size: 12px;
    color: #757c82;
  }

  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

  .hello {
    font-size: 30px;
    text-align: right;
    line-height: 70px;
  }

  // end

  // see all course
  .all {
    text-align: center;
    font-size: 14px;
    color: #999aaa;
    margin-bottom: 0;
    cursor: pointer;
  }

  .all:hover {
    color: lightcoral;
  }

  // end tips
  // end courselist

  // start timeline
  // 原模块平移至右侧 文字居右显示
  ::v-deep .el-timeline {
    padding-left: 480px;
  }

  .course {
    ::v-deep .el-timeline-item__timestamp.is-top {
      text-align: end;
    }

    ::v-deep .el-timeline-item__wrapper {
      position: relative;
      left: -490px;
    }

    ::v-deep .el-timeline-item__content {
      text-align: end;
    }
  }

  // end timeline
  
  // data is null tips
  .nulltips {
    padding: 100px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }
</style>
