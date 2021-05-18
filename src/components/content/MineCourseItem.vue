<template>
  <div v-if="data.length != 0">
    <div v-for="item in data" class="recent">
      <el-row>
        <el-col :xs="24" :sm="24" :md="9" :lg="7" :xl="7">
          <el-image class="group_img" :src="'http://www.train.com/' + item.img" fit="cover"
            @click="toCourseIntro(item)"></el-image>
        </el-col>
        <el-col :xs="24" :sm="24" :md="15" :lg="17" :xl="17">
          <div class="data">
            <div class="first_line">
              <el-tag type="info" style="margin-right: 20px;">{{item.type}}</el-tag>
              <span @click="toCourseIntro(item)" class="group_name">{{item.group_name}}</span>
              <span class="top" v-show="item.is_top == 1">置顶</span>
              <!-- 悬浮tooltips -->
              <el-dropdown style="float: right;" @command="handleCommand($event, item)">
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="top" v-if="item.is_top == 0">置顶</el-dropdown-item>
                  <el-dropdown-item command="cancel" v-else>取消置顶</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- end tooltips -->
            </div>
            <div class="second_line">
              <span class="chapter" v-if="item.is_finished == 1">已学完</span>
              <span class="recent_learn">
                <span style="color: black; font-weight: bold">最近学习：</span>
                <a @click="toCourseVideo(item)" class="group_href">{{item.course_name}}</a>
              </span>
            </div>
            <div class="third_line">
              <a v-if="item.course_name != '暂无'" class="learn_button" @click="toCourseVideo(item)">继续学习</a>
              <a v-else class="learn_button" @click="toCourseVideo(item)">开始学习</a>
            </div>
          </div>
        </el-col>
      </el-row>
      <p class="line"></p>
    </div>
  </div>
  <div v-else>
    <p class="nulltips">暂无此类课程</p>
  </div>
</template>

<script>
  import * as re_course from '../../network/front_course.js'
  import {
    durationDeal
  } from '../../assets/js/normal.js'
  import * as re_collect from '../../network/mine/collect.js'
  export default {
    name: 'MineCourseItem',
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        pushData: [],
        menulist: [],
        indexlist: [],
        clist: [],
        videoData: []
      }
    },
    methods: {
      // 跳转至用户的单个课程详情页
      toCourseIntro(val) {
        re_course.getCourseDetail(val.group_id).then(res => {
          if (res.data.error_code == 0) {
            this.pushData = res.data.data.list
            // console.log(val);
            if (val.type == '线上课程') {
              this.$router.push({
                name: 'Course_Detail',
                query: {
                  data: JSON.stringify(this.pushData)
                }
              })
            } else {
              this.$router.push({
                name: 'Course_Offline_Detail',
                query: {
                  data: JSON.stringify(this.pushData)
                }
              })
            }
          }
        })
      },
      // 跳转至用户的单个课程视频页
      toCourseVideo(val) {
        // console.log(val);
        this.getData(val)
        re_course.getCourseDetail(val.group_id).then(res => {
          setTimeout(() => {
            if (val.type == '线上课程') {
              if (val.course_name == '暂无' || val.course_name == null) { // 没有学过
                this.$router.push({
                  name: 'Course_Video',
                  query: {
                    data: JSON.stringify(this.menulist[Object.keys(this.menulist)[0]][0]),
                    menulist: JSON.stringify(this.menulist),
                    course_data: JSON.stringify(res.data.data.list),
                    indexlist: JSON.stringify(this.indexlist),
                    clist: JSON.stringify(this.clist)
                  }
                })
              } else {
                // console.log(this.user_course);
                this.$router.push({
                  name: 'Course_Video',
                  query: {
                    data: JSON.stringify(this.videoData),
                    menulist: JSON.stringify(this.menulist),
                    course_data: JSON.stringify(res.data.data.list),
                    indexlist: JSON.stringify(this.indexlist),
                    clist: JSON.stringify(this.clist)
                  }
                })
              }
            } else {
              this.$router.push('/Mine_Class')
            }
          }, 1000)
        })
      },
      getData(val) {
        re_course.getMenuList(val.group_id).then(res => {
          if (res.data.error_code == 0) {
            this.menulist = res.data.data.list
            this.indexlist = res.data.data.index
            this.dataDeal()
            this.indexlist.forEach(i => {
              durationDeal(this.menulist[i])
            })
            this.getUserCourse()
            this.getCourseVideo(val)
          } else {
            this.menulist = []
            this.indexlist = []
          }
        })
      },
      // 数据处理
      dataDeal() {
        this.indexlist.forEach(i => {
          this.menulist[i].forEach(item => {
            item.course_id = item.course_id.toString()
          })
        })
      },
      getUserCourse() {
        re_collect.judgeCourse(this.$store.getters.getCurrentUserList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.clist = res.data.data.list
          } else {
            this.clist = []
          }
        })
      },
      getCourseVideo(val) {
        re_course.getCourseVideo(val.group_id, val.course_name).then(res => {
          if (res.data.error_code == 0) {
            this.videoData = res.data.data.list
          } else {
            this.videoData = []
          }
        })
      },
      // 置顶
      handleCommand(command, val) {
        // if (command == 'top') {
        //   console.log('top');
        re_course.topHideCourse(val.id, 'top').then(res => {
          if (res.data.error_code == 0) {
            this.$emit('updateList')
          }
        })
        // }
      }
    }
  }
</script>

<style lang="scss" scoped>
  // dropdown-menu
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover,
  ::v-deep .el-dropdown-menu__item:focus {
    color: #eea412;
    background-color: white;
  }

  // end dropdown-menu

  // start courselist
  .recent {
    a {
      cursor: pointer;
    }

    .line {
      border-bottom: 1px solid #d9dde1;
      margin: 10px;
    }

    .group_img {
      height: 136px;
      width: 240px;
      margin: 10px;
      box-shadow: 0 2px 8px 0 rgba(7, 17, 27, 0.1);
      // margin-left: 30px;
      cursor: pointer;
    }

    .data {
      // width: 650px;
    }

    .group_name {
      font-size: 20px;
      color: #07111b;
      font-weight: 700;
      line-height: 36px;
      cursor: pointer;
    }

    .group_name:hover {
      color: lightsalmon;
    }

    .first_line {
      margin: 20px 10px;
    }

    .second_line {
      margin-left: 10px;

      .recent_learn {
        line-height: 24px;
        font-size: 14px;
        color: #4d555d;

        .group_href:hover {
          color: lightsalmon;
        }
      }

      .chapter {
        line-height: 24px;
        font-size: 14px;
        color: lightsalmon;
        margin-right: 20px;
        font-weight: bold;
      }
    }

    .third_line {
      .learn_button {
        display: inline-block;
        margin-top: 10px;
        float: right;
        font-size: 14px;
        border: none;
        color: #fff;
        width: 104px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: rgba(240, 20, 20, .6);
        border-radius: 18px;
      }

      .learn_button:hover {
        background-color: #f01414;
      }

    }
  }

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

  .top {
    color: white;
    background: rgba(240, 20, 20, 0.6);
    border-radius: 4px;
    margin-left: 10px;
    /* line-height: 26px; */
    font-size: 13px;
    padding: 2px;
    display: inline-block;
  }
</style>
