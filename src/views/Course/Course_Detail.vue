<template>
  <div style="background-color: #f8fafc;" class="wrap">
    <home-nav-bar></home-nav-bar>
    <!-- title -->
    <el-row>
      <el-col class="courseTitle">
        <div class="container">
          <div>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
              <el-breadcrumb-item :to="{ path: '/Front_Course' }">课程</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/Front_Course' }">{{data.type == '线上课程' ? '网课' : '实体课'}}
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{data.group_name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="title">{{data.group_name}}</div>
          <div class="collect_wrap" @click="addCollect">
            <i class="el-icon-star-off" v-if="flag == false"></i>
            <i class="el-icon-star-on" v-else style="color: lightcoral;"></i>
            <span style="font-size: 12px;">收藏</span>
          </div>
          <el-row>
            <el-col class="hidden-sm-only hidden-xs-only" :xs="24" :sm="24" :md="12" :lg="12" :xl="12"></el-col>
            <el-col :xs="24" :sm="20" :md="12" :lg="12" :xl="12">
              <el-row>
                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
                  <div class="label-data">无期限</div>
                  <div class="label">视频有效期</div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" class="pipe"></el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                  <div class="label-data">{{data.course_count}}节</div>
                  <div class="label">节数</div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" class="pipe"></el-col>
                <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
                  <div class="label-data">{{data.participants_num}}人</div>
                  <div class="label">学习人数</div>
                </el-col>
                <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="1" class="pipe"></el-col>
                <el-col :xs="8" :sm="8" :md="8" :lg="7" :xl="7">
                  <el-rate class="title_rate" v-model="totalRate" disabled show-score text-color="#ff9900"
                    score-template="{value}分"></el-rate>
                  <div class="label">课程评分</div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div class="buy" v-if="is_login == true && clist.includes(data.group_id)">
            <div v-if="user_course.learned_chapter != 0" class="button"><a class="a" @click="return_study()">继续学习</a>
            </div>
            <div v-else class="button"><a class="a" @click="return_study()">开始学习</a></div>
          </div>
          <div class="buy" v-else-if="is_login == true && isCoachCourse == true">
            <div class="button"><a class="a" @click="toCoachVideo">查看视频</a></div>
          </div>
          <div class="buy" v-else>
            <div class="button"><a class="a"
                @click="toBuyCourse">{{data.newPrice === '免费' ? '￥0.00&nbsp;购买' : data.newPrice + '&nbsp;购买'}}</a>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- end title -->

    <!-- nav -->
    <div class="nav-wrap">
      <div class="nav-container">
        <ul class="clearfix">
          <li class="fl"><a @click="toIntroduce">课程介绍</a></li>
          <li class="fl"><a @click="toMenu">课程目录</a></li>
          <li class="fl"><a @click="toReview">课程评价</a></li>
        </ul>
      </div>
    </div>
    <!-- end nav -->

    <div class="container select-wrap">
      <el-row :gutter="10" style="margin-bottom: 8px;">
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <el-row>
            <el-col id="introduce" style="margin-bottom: 10px;">
              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span><span class="line"></span>课程介绍</span>
                </div>
                <div class="text item" v-html="data.introduction">
                </div>
              </el-card>
            </el-col>
            <!-- menu_list -->
            <el-col id="menu" style="margin-bottom: 10px;">
              <menu-list @toLearn="toLearn" :group_id="data.group_id" :course_name="user_course.course_name"
                :clist="clist" ref="menu"></menu-list>
            </el-col>
            <el-col id="review" style="margin-bottom: 10px;">
              <rate-review :data="data" @getRate="getRate" :clist="clist"></rate-review>
            </el-col>
          </el-row>
        </el-col>
        <!-- recommend_list -->
        <el-col class="hidden-sm-only hidden-xs-only" :sm="24" :md="6" :lg="6" :xl="6">
            <front-recommend @toDetail="toDetail" :data="data"></front-recommend>

        </el-col>
      </el-row>
    </div>
    <copy-right></copy-right>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  // import {
  //   deal2,
  //   durationDeal
  // } from '../../assets/js/normal.js'
  import FrontRecommend from '../../components/content/front_course/FrontRecommend.vue'
  import MenuList from '../../components/content/front_course/MenuList.vue'
  import RateReview from '../../components/content/front_course/RateReview.vue'
  import HomeNavBar from '../../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../../components/content/CopyRight.vue'
  import BackToTop from '../../components/content/BackToTop.vue'
  import * as re_collect from '../../network/mine/collect.js'
  import * as coach_course from '../../network/manage/course_list.js'
  import * as re_course from '../../network/front_course.js'
  export default {
    name: "Course_Detail",
    components: {
      HomeNavBar,
      CopyRight,
      BackToTop,
      FrontRecommend,
      MenuList,
      RateReview,
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        user_course: [], //用户学习记录

        data: [],
        pushData: [],
        collectList: [], // 收藏夹
        flag: false,
        totalRate: 5,
        isCoachCourse: false,
        coach_list: [],

        clist: [], // 用户已拥有的课程列表
      }
    },
    methods: {
      toIntroduce() {
        // 平滑滚动 + 消除地址栏路由显示
        document.querySelector("#introduce").scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      },
      toMenu() {
        document.querySelector("#menu").scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      },
      toReview() {
        document.querySelector("#review").scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      },
      // 开始学习——跳转视频页
      toLearn(val) {
        // console.log(val)
        this.pushData = val
        this.$router.push({
          path: '/Course_Video',
          query: {
            data: JSON.stringify(this.pushData),
            menulist: JSON.stringify(this.$refs.menu.menulist),
            course_data: JSON.stringify(this.data),
            indexlist: JSON.stringify(this.$refs.menu.indexlist),
            clist: JSON.stringify(this.clist)
          }
        })
      },
      // 跳转购买页
      toBuyCourse() {
        if(this.is_login == true && (this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练')){
          this.$message({
            type: 'info',
            message: '您当前身份为教练，若要购买课程，请切换为普通用户账号！'
          })
          return ''
        }
        if (this.is_login === true) {
          this.$router.push({
            name: 'Front_Buy_Course',
            query: {
              course_data: JSON.stringify(this.data)
            }
          })
        } else {
          this.$router.push('/Login')
        }
      },
      // 添加收藏
      addCollect() {
        if (this.is_login === true) {
          re_collect.addCollect(this.userInfoList.uid, this.data.group_id).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.getCollect()
            }
          })
        } else {
          this.$router.push('/Login')
        }
      },
      // 获取收藏夹列表
      getCollect() {
        if (this.is_login === true) {
          re_collect.getCollect(this.user).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.collectList = res.data.data.filter(item => {
                return item.collect_type == 'course'
              })
            } else {
              this.collectList = []
            }

            this.flag = this.collectList.some(item => {
              return item.group_id == this.data.group_id
            })

          })
        } else {
          this.collectList = []
          this.flag = false
        }
      },
      // 获取课程信息
      getCourseData() {
        re_collect.userCourseIntro(this.data.group_id, this.userInfoList.uid).then(res => {
          if (res.data.error_code == 0) {
            this.user_course = res.data.data.list
          } else {
            this.user_course = []
          }
        })
      },
      // 推荐跳转其他
      // 跳转判断
      getUserCourse() {
        re_collect.judgeCourse(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.clist = res.data.data.list
          } else {
            this.clist = []
          }
        })
      },
      toView(val) {
        if (val.type == '线上课程') {
          this.$router.push({
            name: 'Course_Detail',
            query: {
              data: JSON.stringify(val)
            }
          })
        } else {
          this.$router.push({
            name: 'Course_Offline_Detail',
            query: {
              data: JSON.stringify(val)
            }
          })
        }
      },
      toDetail(val) {
        this.toView(val)
      },
      getRate(val) {
        this.totalRate = val
      },
      return_study() {
        // 获取第一个视频
        console.log(this.data);
        console.log(this.$refs.menu.menulist[Object.keys(this.$refs.menu.menulist)[0]][0]);
        if (this.user_course.course_name == '暂无' || this.user_course.course_name == null) { // 没有学过
        if (this.is_login == true && this.clist.includes(this.data.group_id)) {
          re_course.changeRecentLearn(this.userInfoList.uid, this.data.group_id, this.$refs.menu.menulist[Object.keys(this.$refs.menu.menulist)[0]][0].course_name).then(res => {
            // 更改最近学习视频名
          })
        }
          this.$router.push({
            name: 'Course_Video',
            query: {
              data: JSON.stringify(this.$refs.menu.menulist[Object.keys(this.$refs.menu.menulist)[0]][0]),
              menulist: JSON.stringify(this.$refs.menu.menulist),
              course_data: JSON.stringify(this.data),
              indexlist: JSON.stringify(this.$refs.menu.indexlist),
              clist: JSON.stringify(this.clist)
            }
          })
        } else {
          // console.log(this.user_course);
          this.$router.push({
            name: 'Course_Video',
            query: {
              data: JSON.stringify(this.user_course),
              menulist: JSON.stringify(this.$refs.menu.menulist),
              course_data: JSON.stringify(this.data),
              indexlist: JSON.stringify(this.$refs.menu.indexlist),
              clist: JSON.stringify(this.clist)
            }
          })
        }
      },
      toCoachVideo() {
        this.$router.push({
          name: 'Course_Video',
          query: {
            data:  JSON.stringify(this.$refs.menu.menulist[Object.keys(this.$refs.menu.menulist)[0]][0]),
            menulist: JSON.stringify(this.$refs.menu.menulist),
            course_data: JSON.stringify(this.data),
            indexlist: JSON.stringify(this.$refs.menu.indexlist),
            clist: JSON.stringify(this.clist)
          }
        })
      },
      getCoachCourse(){
        coach_course.getCourseList(this.userInfoList.uid).then(res=>{
          // console.log(res.data);
          if(res.data.error_code == 0){
            this.coach_list = res.data.data.list
            this.isCoachCourse = this.coach_list.some(item => {
              return item.group_id == this.data.group_id
            })
            // console.log(this.isCoachCourse);
          }else{
            this.coach_list = []
          }
        })
      }
    },
    watch: {
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.data = JSON.parse(to.query.data)
        }
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.reviewlist = []
      if (this.$route.query.data) {
        this.data = JSON.parse(this.$route.query.data)
      }
      if (this.is_login == true) {
        this.getUserCourse()
        this.getCourseData()
        if(this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练'){
          this.getCoachCourse()
        }
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import url('../../assets/css/style.css');

  a {
    cursor: pointer;
  }

  ::v-deep .el-row {
    // margin-right: -15px;
    margin-left: -15px;
  }

  // ::v-deep .el-col{
  //   padding-right: 15px;
  //   padding-left: 15px;
  // }
  // 大标题信息
  .courseTitle {
    padding-bottom: 20px;
    padding-top: 20px;
    background-image: url(../../assets/img/coursebg.png);
    background-size: cover;

    .bread {
      display: inline-block;
      height: 30px;
      line-height: 30px;
      vertical-align: middle;
      font-size: 14px;

      ::v-deep .el-breadcrumb__inner {
        color: #ccccd8;
        font-weight: normal;
      }

      ::v-deep .el-breadcrumb__inner:hover {
        color: white;
        cursor: pointer;
      }
    }

    .collect_wrap {
      display: inline-flex;
      height: 30px;
      line-height: 30px;
      color: white;
      margin-left: 20px;
      cursor: pointer;
    }

    .collect_wrap:hover {
      color: lightcoral;
    }

    ::v-deep .el-icon-star-off,
    ::v-deep .el-icon-star-on {
      font-size: 22px;
    }

    .title {
      font-size: 32px;
      font-weight: bold;
      color: #fff;
      display: inline-flex;
    }

    .label-data {
      font-size: 20px;
      font-weight: bold;
      color: #fff;
      text-align: center;
    }

    .label {
      font-size: 14px;
      color: #fff;
      text-align: center;
    }

    // 分割线
    .pipe {
      width: 0.1px;
      background: #d8d8d8;
      height: 40px;
      margin-top: 7px;
    }

    // 购买按钮
    .buy {
      padding: 15px 0;

      .button {
        display: inline-block;
        width: 166px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        background: -webkit-gradient(linear, left top, left bottom, from(#fe8e5f), to(#fc5531));
        background: linear-gradient(180deg, #fe8e5f, #fc5531);
        -webkit-box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
        border-radius: 4px;
        position: relative;

        .a {
          display: inline-block;
          width: 100%;
          height: 100%;
          font-size: 18px;
          font-family: PingFangSC-Semibold, PingFang SC;
          font-weight: 600;
          color: #fff;
        }
      }
    }

    .title_rate {
      margin: 10px 0 5px 0;
      text-align: center;

      ::v-deep .el-rate__text {
        font-size: 18px;
        // float: right;
      }

      ::v-deep .el-rate__icon {
        margin-right: 4px;
        font-size: 18px;
      }
    }
  }

  // 目录导航条
  .nav-wrap {
    background: #fff;
    position: relative;
    margin: 0 auto !important;
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, .1);
  }

  .nav-container {
    margin: 0 auto !important;
    width: 1200px;

    .clearfix {
      width: 1200px;
      height: 64px;
    }

    .fl {
      height: 100%;
      line-height: 64px;
      float: left;
      list-style-type: none;
      list-style: none;
      margin-left: 64px;
      font-weight: bold;
      color: #555666;
      font-size: 16px;
    }

    .fl a:hover {
      color: #000;
    }

    .fl a:active {
      color: #000;
    }
  }

  .nav-container ul>li:first-child {
    margin-left: 30px;
  }

  .fl a:active::after {
    display: block;
    content: "";
    position: relative;
    left: 50%;
    bottom: 15px;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    width: 24px;
    height: 2px;
    background: #222226;
    border-radius: 1px;
  }

  // 卡片
  // 标题前红色竖线
  .line {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #fc5531;
    vertical-align: -2px;
    margin-right: 8px;
  }

  ::v-deep .el-card__header {
    border: none;
  }

  ::v-deep .el-card__body {
    padding: 0 20px 20px 20px;

    .text {
      padding-left: 12px;
    }
  }

  ::v-deep .el-card {
    box-shadow: 0 2px 8px 0 rgba(7, 17, 27, .1);
    border-radius: 8px;
  }
</style>
