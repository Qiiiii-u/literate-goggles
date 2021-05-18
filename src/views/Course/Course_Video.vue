<template>
  <div style="background-color: #f8fafc;" class="wrap">
    <home-nav-bar></home-nav-bar>

    <div style="background-color: #222226;">
      <div class="container select-wrap">
        <el-row>
          <el-col>
            <el-breadcrumb separator-class="el-icon-arrow-right" class="bread">
              <el-breadcrumb-item :to="{ path: '/Front_Course'}">课程首页</el-breadcrumb-item>
              <el-breadcrumb-item :to="{ path: '/Front_Course' }">{{course_data.type == '线上课程' ? '网课' : '实体课'}}
              </el-breadcrumb-item>
              <el-breadcrumb-item>{{data.course_name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :xs="24" :sm="17" :md="18" :lg="18" :xl="18">
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
              :options="playerOptions" @playing="onPlayerPlaying($event)" @pause="onPlayerPause($event)"
              v-if="is_login == true && clist.includes(course_data.group_id)"></video-player>
            <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true"
              :options="playerOptions" v-else></video-player>
          </el-col>
          <el-col :xs="24" :sm="7" :md="6" :lg="6" :xl="6" class="menu_box">
            <el-tabs :stretch="true" value="first">
              <el-tab-pane label="目录" name="first">
                <vue-scroll :ops="ops" :style="{'height': menu_height-tab_height+'px'}">
                  <div class="course_box">
                    <el-menu :default-active="data.course_id_re" active-text-color="#eea412">
                      <el-submenu v-for="i in indexlist" :index="i">
                        <template slot="title">
                          <span>{{i}}</span>
                        </template>
                        <el-menu-item v-for="item in menulist[i]" :index="item.course_id" @click="toOtherVideo(item)">
                          <section style="display: inline-block;padding: 0 9px 0 7px;"
                            v-if="item.course_id == data.course_id">
                            <icon-bofang width="12" height="12" />
                          </section>
                          <i class="el-icon-video-play" v-else></i>
                          <span slot="title">{{item.course_name}}</span>
                          <span class="time">{{item.time}}</span>
                        </el-menu-item>
                      </el-submenu>
                    </el-menu>
                  </div>
                </vue-scroll>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col style="padding: 20px 0;">
            <div class="course_name">{{course_data.group_name}}&nbsp;&nbsp;{{data.course_name}}</div>
            <div class="buy" v-if="isCoachCourse == true ? false : (is_login != true || !clist.includes(course_data.group_id))">
              <div class="button"><a class="a"
                  @click="toBuyCourse">{{course_data.newPrice === '免费' ? '￥0.00&nbsp;购买' : course_data.newPrice + '&nbsp;购买'}}</a>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- nav -->
    <div class="nav-wrap">
      <div class="nav-container">
        <ul class="clearfix">
          <li class="fl"><a @click="toIntroduce">课程介绍</a></li>
        </ul>
      </div>
    </div>
    <!-- end nav -->

    <div class="container select-wrap">
      <el-row :gutter="10" style="margin-bottom: 8px;">
        <el-col :xs="24" :sm="24" :md="18" :lg="18" :xl="18">
          <el-card class="box-card" shadow="never" id="introduce">
            <div slot="header" class="clearfix">
              <span><span class="line"></span>课程介绍</span>
            </div>
            <div class="text item" v-html="course_data.introduction"></div>
          </el-card>
        </el-col>
        <!-- recommend_list -->
        <el-col class="hidden-sm-only hidden-xs-only" :sm="24" :md="6" :lg="6" :xl="6">
          <front-recommend @toDetail="toDetail" :data="course_data"></front-recommend>
        </el-col>
      </el-row>
    </div>

    <copy-right></copy-right>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  import IconBofang from '../../components/content/front_course/IconBofang.vue'
  import FrontRecommend from '../../components/content/front_course/FrontRecommend.vue'
  import HomeNavBar from '../../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../../components/content/CopyRight.vue'
  import BackToTop from '../../components/content/BackToTop.vue'
  import * as re_course from '../../network/front_course.js'
  import * as coach_course from '../../network/manage/course_list.js'
  export default {
    name: 'Course_Video',
    components: {
      IconBofang,
      HomeNavBar,
      CopyRight,
      BackToTop,
      FrontRecommend,
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],

        data: [],
        menulist: [],
        indexlist: [],
        course_data: [],
        clist: [],

        isCoachCourse: false,
        coach_list: [],

        menu_height: 0,
        tab_height: 0,
        href: '',
        // video配置
        playerOptions: {
          height: 400,
          playbackRates: [0.5, 1.0, 1.5, 2.0], // 播放速度
          autoplay: false, // 如果true,浏览器准备好时开始回放。
          muted: false, // 默认情况下将会消除任何音频。
          loop: false, // 导致视频一结束就重新开始。
          preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
          language: "zh-CN",
          aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
          fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
          sources: [{
            type: "video/mp4", // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: '' // url地址
          }],
          // poster: require("@/assets/poster.png"), // 你的封面地址
          // width: document.documentElement.clientWidth, //播放器宽度
          notSupportedMessage: "此视频暂无法播放，请稍后再试", // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
          controlBar: {
            timeDivider: true,
            durationDisplay: true,
            remainingTimeDisplay: false,
            fullscreenToggle: true // 全屏按钮
          }
        },
        // 滚动条配置
        ops: {
          vuescroll: {},
          scrollPanel: {},
          rail: {
            keepShow: true
          },
          bar: {
            hoverStyle: true,
            onlyShowBarOnScroll: false, //是否只有滚动的时候才显示滚动条
            background: "#000", //滚动条颜色
            opacity: 0.5, //滚动条透明度
            size: '5px'
          }
        },
        timer: "",
        hour: 0,
        minute: 0,
        seconds: 0,
        flag: false,
        count: 0,
        i: 0

      }
    },
    methods: {
      toIntroduce() {
        document.querySelector("#introduce").scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        })
      },
      toDetail(val) {
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
      // 暂停回调
      onPlayerPause(player) {
        this.flag = false
        console.log('pause', this.hour, this.minute, this.seconds)
      },
      //已开始播放回调
      onPlayerPlaying(player) {
        this.flag = true
        if (this.count == 0) {
          this.timer = setInterval(this.startTimer, 1000)
          this.count = 1
        }
      },
      // 计时器
      startTimer() {
        if (this.flag) {
          this.seconds += 1;
          if (this.seconds >= 60) {
            this.seconds = 0;
            this.minute = this.minute + 1;
          }
          if (this.minute >= 60) {
            this.minute = 0;
            this.hour = this.hour + 1;
          }
        }
      },
      // 存储学习时间
      saveTime() {
        re_course.addLearnTime(this.userInfoList.uid, this.hour * 3600 + this.minute * 60 + this.seconds).then(res => {
          // console.log(res.data)
        })
      },
      // 选择的目录——播放item
      toOtherVideo(val) {
        // console.log(val)
        if (this.is_login == true && this.clist.includes(this.course_data.group_id)) {
          re_course.changeRecentLearn(this.userInfoList.uid, this.data.group_id, val.course_name).then(res => {
            // 更改最近学习视频名
          })
        }
        this.$router.push({
          name: 'Course_Video',
          query: {
            data: JSON.stringify(val),
            menulist: JSON.stringify(this.menulist),
            course_data: JSON.stringify(this.course_data),
            indexlist: JSON.stringify(this.indexlist),
            clist: JSON.stringify(this.clist)
          }
        })
      },
      // 跳转购买页
      toBuyCourse() {
        if (this.is_login == true && (this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练')) {
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
              course_data: JSON.stringify(this.course_data)
            }
          })
        } else {
          this.$router.push('/Login')
        }
      },
      getCoachCourse(){
        coach_course.getCourseList(this.userInfoList.uid).then(res=>{
          // console.log(res.data);
          if(res.data.error_code == 0){
            this.coach_list = res.data.data.list
            this.isCoachCourse = this.coach_list.some(item => {
              return item.group_id == this.course_data.group_id
            })
            console.log(this.isCoachCourse);
          }else{
            this.coach_list = []
          }
        })
      }
    },
    watch: {
      $route(to, from) { //目录跳转
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.data = JSON.parse(to.query.data)
          this.course_data = JSON.parse(to.query.course_data)
          this.data.course_id_re = this.data.course_id.toString()
          this.href = 'http://www.train.com/' + this.data.course_content
          this.playerOptions.sources[0].src = this.href
        }
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      if (this.$route.query.data) {
        this.data = JSON.parse(this.$route.query.data)
        this.menulist = JSON.parse(this.$route.query.menulist)
        this.course_data = JSON.parse(this.$route.query.course_data)
        this.indexlist = JSON.parse(this.$route.query.indexlist)
        this.clist = JSON.parse(this.$route.query.clist)
      }
      if(this.is_login && (this.userInfoList.identity == 'coach' || this.userInfoList.identity == '教练')){
        this.getCoachCourse()
      }
      // console.log(this.$route.query);
      this.href = 'http://www.train.com/' + this.data.course_content
      this.data.course_id_re = this.data.course_id.toString()
      this.playerOptions.sources[0].src = this.href
    },
    mounted() {
      this.$nextTick(() => {
        this.menu_height = this.$refs.videoPlayer.$refs.video.clientHeight
        this.tab_height = document.querySelector('.el-tabs__header').offsetHeight
      })
    },
    destroyed() {
      this.flag = false
      clearInterval(this.timer); // 摧毁计时器
      console.log('close the web', this.hour, this.minute, this.seconds)
      if (this.is_login == true) {
        this.saveTime()
      }
    },
  }
</script>

<style lang="scss" scoped>
  .bread {
    display: inline-block;
    height: 64px;
    line-height: 64px;
    vertical-align: middle;
    font-size: 14px;

    ::v-deep .el-breadcrumb__inner {
      color: #999aaa;
      font-weight: normal;
    }

    ::v-deep .el-breadcrumb__inner:hover {
      color: #ccccd8;
      cursor: pointer;
    }
  }

  .menu_box {
    background-color: #2c2c2c;

    ::v-deep .el-tabs__item.is-active {
      color: #eea412;
    }

    ::v-deep .el-tabs__header {
      margin: 0;
    }

    ::v-deep .el-tabs__active-bar {
      background-color: #eea412;
    }

    ::v-deep .el-menu {
      background-color: #2c2c2c;
      border: none;
    }

    ::v-deep .el-submenu__title {
      color: #fff;
      height: 48px;
      line-height: 48px;
    }

    ::v-deep .el-submenu__title:hover {
      background-color: #2c2c2c;
      color: #eea412;
    }

    ::v-deep .el-menu-item {
      padding-left: 10px !important;
      padding-right: 15px !important;
      height: 32px;
      line-height: 32px;
      color: #999aaa;
    }

    ::v-deep .el-menu-item:hover,
    ::v-deep .el-menu-item:focus {
      background-color: #2c2c2c;
      color: #eea412;
    }

    ::v-deep .el-menu-item:hover *,
    ::v-deep .el-menu-item:focus * {
      color: #eea412;
    }

    ::v-deep .el-menu-item * {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
      line-height: 32px;
    }

    .time {
      float: right;
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

  // end nav

  // 红色竖线
  .line {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #fc5531;
    vertical-align: -2px;
    margin-right: 8px;
  }

  // el-card样式
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

  // end

  // 购买
  .course_name {
    color: #ccccd8;
    font-size: 20px;
    display: inline-flex;
  }

  .buy {
    float: right;

    .button {
      display: inline-block;
      width: 160px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: linear-gradient(90deg, #f66, #fc5531);
      border-radius: 2px;
      position: relative;

      .a {
        display: inline-block;
        width: 100%;
        height: 100%;
        font-size: 14px;
        color: #fff;
      }
    }
  }

  // end buy
  a {
    cursor: pointer;
  }
</style>
