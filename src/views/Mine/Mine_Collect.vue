<template>
  <div>
    <el-card class="box-card">
      <!-- tabs -->
      <el-tabs value="first">
        <el-tab-pane label="课程" name="first">
          <div v-if="course_list.length != 0">
            <div v-for="item in course_list" class="recent">
              <el-row>
                <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
                  <el-image style="width: 200px;margin: 20px;" :src="'http://www.train.com/' + item.img" fit="contain"
                    @click="toCourse(item)"></el-image>
                </el-col>
                <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
                  <div class="data">
                    <div class="first_line">
                      <el-tag type="info" style="margin-right: 20px;">{{item.type}}</el-tag>
                      <span class="group_name" @click="toCourse(item)">{{item.group_name}}</span>
                    </div>
                    <div class="second_line">
                      {{item.new_intro}}
                    </div>
                    <div class="third_line">
                      <el-link :underline="false" @click="cancelCollect(item)">取消收藏</el-link>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <p class="line"></p>
            </div>
          </div>
          <div v-else>
            <p class="nulltips">你还没有收藏任意一个课程，可以先去挑选噢</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="百科" name="second">
          <div v-if="knowledge_list.length != 0">
            <div v-for="item in knowledge_list" class="recent">
              <el-row>
                <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
                  <el-image style="width: 200px;height:124px;margin: 20px;" :src="require('../../assets/img/blog_5.jpg')"
                    fit="cover" @click="toKnowledge(item)"></el-image>
                </el-col>
                <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
                  <div class="data">
                    <div class="first_line">
                      <el-tag type="info" style="margin-right: 20px;">{{item.type}}</el-tag>
                      <span class="group_name" @click="toKnowledge(item)">{{item.title}}</span>
                    </div>
                    <div class="second_line">
                      <span class="author">作者：{{item.author}}</span>
                    </div>
                    <div class="third_line">
                      <el-link :underline="false" @click="cancelCollect(item)">取消收藏</el-link>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <p class="line"></p>
            </div>
          </div>
          <div v-else>
            <p class="nulltips">你还没有收藏任意一则百科，可以先去看看噢</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- end tabs -->
      <p class="card_title">推荐课程</p>
      <recommend-list @toCourse="toCourse"></recommend-list>
    </el-card>
  </div>
</template>

<script>
  import RecommendList from '../../components/content/RecommendList.vue'
  import {
    deal
  } from '../../assets/js/normal.js'
  import * as re_collect from '../../network/mine/collect.js'
  export default {
    name: 'Mine_Collect',
    components: {
      RecommendList
    },
    data() {
      return {
        // state数据
        is_login: false,
        user: '',
        userInfoList: [],
        // 后端数据
        dataList: [],
        course_list: [],
        knowledge_list: [],

        clist: [],
      }
    },
    methods: {
      // 获取收藏夹内容
      getList() {
        re_collect.getCollect(this.user).then(res => {
          if (res.data.error_code == 0) {
            this.dataList = res.data.data
            this.course_list = this.dataList.filter(item => {
              return item.collect_type == 'course'
            })
            deal(this.course_list)
            this.knowledge_list = this.dataList.filter(item => {
              return item.collect_type == 'knowledge'
            })
          } else {
            this.dataList = []
          }

        })
      },
      // 取消收藏
      cancelCollect(val) {
        re_collect.cancelCollect(val.id, this.userInfoList.uid).then(res => {
          if (res.data.error_code == 0) {
            this.$notify.success({
              title: '提示',
              message: '取消收藏成功',
              showClose: false
            })
            this.getList()
          } else {
            this.$notify.error({
              title: '提示',
              message: '取消收藏失败',
              showClose: false
            })
          }

        })
      },
      // 跳转课程详情页
      toCourse(val) {
        re_collect.judgeCourse(this.userInfoList.uid).then(res => {

          if (res.data.error_code == 0) {
            this.clist = res.data.data.list
          } else {
            this.clist = []
          }
          if (this.clist.includes(val.group_id)) {
            if (val.type == '线上课程') {
              this.$router.push({
                name: 'Course_Detail_User',
                query: {
                  group_id: val.group_id
                }
              })
            } else {
              this.$router.push({
                name: 'Course_Offline_Detail_User',
                query: {
                  group_id: val.group_id
                }
              })
            }
          } else {
            if (val.type == '线下课程') {
              this.$router.push({
                name: 'Course_Offline_Detail',
                query: {
                  data: JSON.stringify(val)
                }
              })
            } else {
              this.$router.push({
                name: 'Course_Detail',
                query: {
                  data: JSON.stringify(val)
                }
              })
            }

          }
        })
      },
      // 跳转百科页
      toKnowledge(val) {
        this.$router.push({
          name: 'News_Detail',
          query: {
            data: JSON.stringify(val)
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
  // start courselist
  .recent {

    // 图片手势
    ::v-deep .el-image {
      cursor: pointer;
    }

    e .line {
      border-bottom: 1px solid #d9dde1;
      margin: 10px;
    }

    // .data {
    //   width: 700px;
    // }

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
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      // width: 600px;
      font-size: 13px;
      color: #999;
    }

    .third_line {
      float: right;
      margin-top: 10px;
      margin-top: 40px;

      ::v-deep .el-link--inner {
        font-size: 13px;
      }

      ::v-deep .el-link.el-link--default:hover {
        color: lightsalmon
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
  // end courselist

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
