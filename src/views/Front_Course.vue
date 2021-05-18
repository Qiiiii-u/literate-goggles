<template>
  <div class="wrap" style="background-color: #F4F4F4">
    <home-nav-bar></home-nav-bar>

    <!-- 筛选 -->
    <div class="container select-wrap">
      <el-row>
        <el-col style="padding: 0;">
          <div class="inner-hmv" style="padding: 15px;">
            <div class="select-label" v-for="(item, index) in filter_label" :key="index"
              :style="{marginBottom: (item.type == 'type' ? '10px' : '0')}">
              <label>{{item.type == 'type' ? '形式' : '分类'}}</label>
              <span v-for="(tag, i) in item.list" :key="i" @click="item.type == 'type' ? addLabel('type', tag.tag) : addLabel('sport', tag.tag)"
                :class="{'active': (activeLabel.type === tag.tag && item.type == 'type') || (activeLabel.sport === tag.tag && item.type == 'sport')}">{{tag.name}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- end filter -->

    <!-- 课程列表 -->
    <div class="courselist">
      <div class="container">
        <el-row style="background-color: #fff;margin-bottom: 20px;">
          <el-col>
            <el-row>

              <el-col class="content-top">
                <div class="left">
                  <ul>
                    <li class="tabitem" @click="sort('hot')">热门</li>
                    <li class="tabitem" @click="sort('new')">最新</li>
                    <li class="tabitem" @click="sort('price')"
                      :class="{'top-change':flag == 1, 'bottom-change': flag == 2}">价格
                      <i class="el-icon-caret-top" /><i class="el-icon-caret-bottom" />
                    </li>
                  </ul>
                </div>
                <div class="middle">
                  <el-input v-model="search" size="mini" placeholder="输入关键字搜索"/>
                </div>
                <div class="right">
                  <div>共{{filter_count}}个结果</div>
                </div>
              </el-col>
              <el-col v-if="currentDataList.length == []">
                <p class="nulltips">暂时没有此课程哦~</p>
              </el-col>

              <el-col style="margin: 0 12px;">
                <el-row :gutter="30" style="margin-top: 0;">

                  <el-col class="course" :xs="10" :sm="8" :md="6" :lg="4" :xl="4" v-for="item in currentDataList" :key="item.group_id">
                    <el-image @click="toDetail(item)" class="img" :src="href + item.img" fit="cover"></el-image>
                    <a @click="toDetail(item)">
                      <div class="title">{{item.group_name}}</div>
                    </a>
                    <div>
                      <span class="intro">
                        <span v-if="item.course_count != 0">共{{item.course_count}}节&nbsp;|&nbsp;</span>
                        {{item.new_intro}}
                      </span>
                    </div>
                    <div>
                      <span class="price">{{item.newPrice}}</span>
                      <span class="person">{{item.participants_num}}人最近报名</span>
                    </div>
                  </el-col>

                </el-row>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- end course list -->

    <copy-right></copy-right>
    <back-to-top></back-to-top>
  </div>
</template>

<script>
  import HomeNavBar from '../components/content/home_nav_bar/HomeNavBar.vue'
  import CopyRight from '../components/content/CopyRight.vue'
  import BackToTop from '../components/content/BackToTop.vue'
  import * as re_collect from '../network/mine/collect.js'
  import {
    getAllList
  } from '../network/front_course.js'
  export default {
    name: "Front_Course",
    components: {
      HomeNavBar,
      CopyRight,
      BackToTop
    },
    data() {
      return {
        is_login: false,
        user: '',
        userInfoList: [],
        dataList: [],

        total_count: 0,
        filter_count: 0,
        currentDataList: [],
        activeLabel: {
          type: "all",
          sport: "all"
        },
        clist: [],
        oldData: [],
        filterData: [],
        flag: 0,
        search: '',
        href: 'http://www.train.com/',
        filter_label: [{
            type: 'type',
            list: [{
                tag: 'all',
                name: '全部'
              },
              {
                tag: 'online',
                name: '网课'
              },
              {
                tag: 'offline',
                name: '线下课'
              },
              {
                tag: 'free',
                name: '免费课'
              },
              {
                tag: 'charge',
                name: '付费课'
              },
            ],
          },
          {
            type: 'sport',
            list: [{
                tag: 'all',
                name: '全部'
              },
              {
                tag: 'base_sport',
                name: '基础运动'
              },
              {
                tag: 'obstacle',
                name: '障碍运动'
              },
              {
                tag: 'ball',
                name: '球类'
              },
              {
                tag: 'other',
                name: '其他运动'
              },
            ],
          }
        ]
      }
    },
    methods: {
      addLabel(type, value) {
        this.activeLabel[type] = value
        this.filterDataList()
      },
      filterDataList() {
        this.currentDataList = this.dataList.filter(course => {
          var tag = course.tag.split(',') // 切割tag
          return this.currentLabel.every(item => { // ['sport', 'type'] every满足所有条件则返回
            return tag.some(tag_item => { // some: tag只要一个等于所选标签 || 所选标签为‘全部’
              return this.activeLabel[item] === tag_item
            }) || this.activeLabel[item] === 'all'
          })
        })
        this.filter_count = this.currentDataList.length
        // console.log(this.currentDataList)
      },
      getList() {
        getAllList().then(res => {
          // console.log(res.data)
          this.dataList = res.data.data.list
          this.currentDataList = res.data.data.list
          this.filter_count = this.currentDataList.length
          this.total_count = res.data.data.count
          this.dataDeal()
        })
      },
      dataDeal() {
        this.dataList.forEach(item => {
          item.new_intro = item.introduction.replace(/(\n)/g, "").replace(/(\t)/g, "").replace(/(\r)/g, "").replace(
            /<\/?[^>]*>/g, "").replace(/\s*/g, "")
          if (item.price === 0) {
            item.newPrice = '免费'
            item.tag += ',free'
          } else {
            item.price = Math.round(item.price * 100) / 100;
            var s = item.price.toString().split(".");
            if (s.length == 1) {
              item.price = item.price.toString() + ".00";
            } else if (s.length > 1) {
              if (s[1].length < 2) {
                item.price = item.price.toString() + "0";
              }
            }
            item.newPrice = '¥' + item.price
            item.tag += ',charge'
          }
          if (item.type == '线上课程') {
            item.tag += ',online'
          } else {
            item.tag += ',offline'
          }
        })
      },
      getUserCourse(val) {
        if(this.is_login === true){
          re_collect.judgeCourse(this.userInfoList.uid).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.clist = res.data.data.list
            } else {
              this.clist = []
            }
            this.toView(val)
          })
        }else{
          this.toView(val)
        }
      },
      toView(val){
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
      up(property) {
        return function(a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value1 - value2
        }
      },
      dowm(property) {
        return function(a, b) {
          var value1 = a[property]
          var value2 = b[property]
          return value2 - value1
        }
      },
      sort(val) {
        // console.log(this.currentDataList)
        if (val == 'new') {
          this.currentDataList = this.currentDataList.sort(this.dowm('group_id'))
        } else if (val == 'hot') {
          this.currentDataList = this.currentDataList.sort(this.dowm('participants_num'))
        } else if (val == 'price') {
          this.flag += 1
          if (this.flag == 2) {
            this.currentDataList = this.currentDataList.sort(this.dowm('price'))
          } else if (this.flag == 1) {
            this.currentDataList = this.currentDataList.sort(this.up('price'))
          } else {
            this.currentDataList = this.currentDataList.sort(this.up('group_id'))
          }
          if (this.flag == 3) {
            this.flag = 0
          }
        }
      },
      toDetail(val) {
        console.log(val)
        this.getUserCourse(val)
      },
    },
    computed: {
      currentLabel() {
        return Object.keys(this.activeLabel).filter(str => {
          if (this.activeLabel[str] !== '') {
            return true
          }
        })
      }
    },
    watch: {
      search(newValue, oldValue){
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
          this.currentDataList = this.dataList.filter(course => {
            return course.group_name.match(newValue)
          })
          this.filter_count = this.currentDataList.length
        }, 500)
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
  ::v-deep .el-row {
    margin: 15px -15px 10px -15px;
  }

  ::v-deep .el-col {
    padding-right: 15px;
    padding-left: 15px;
  }

  // category
  .select-label span {
    padding: 5px 8px;
    margin-left: 20px;
    cursor: pointer;
  }

  .select-label label {
    background-color: #f5f7f8;
    border-radius: 10px;
    padding: 5px 8px;
  }

  .select-label span.active {
    color: #0069D9;
    background-color: #ecf5ff;
    border-radius: 10px;
    padding: 5px 8px;
  }

  .select-label span:hover {
    color: #0069D9;
  }
  // end

  // courselist
  .courselist {
    .content-top {
      display: flex;

      .left {
        padding-left: 8px;

        .tabitem {
          display: inline-block;
          cursor: pointer;
          color: #555666;
          position: relative;
          line-height: 28px;
          margin-right: 36px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-size: 16px;
        }
      }

      .middle {
        flex: 1;
      }

      .right {
        right: 0;
        // position: absolute;
        line-height: 28px;
        padding-right: 8px;
      }
    }

    // search
    ::v-deep .el-input--mini {
      max-width: 252px;
      float: right;
      right: 30px;
    }

    ::v-deep .el-input__inner:focus {
      border-color: #555666;
      color: #1c1d30;
    }

    ::v-deep .el-input__inner {
      border-radius: 21px;
      padding: 0 24px 0 16px;
      border-color: #dfe1e5;
      color: #dfe1e5;
    }
    // end

    .title {
      margin-bottom: 2px;
      font-size: 14px;
      height: 40px;
      line-height: 1.5;
    }

    .img {
      width: 192px;
      height: 124px;
      min-width: 100%;
      padding-bottom: 5px;
    }

    .price {
      color: #f4621f;
      font-size: 14px;
      font-weight: bold;
    }

    .person {
      padding-left: 10px;
      font-size: 12px;
      color: #999;
    }

    .intro {
      color: #999;
      font-size: 12px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course {
      padding: 15px 0;
      border: 1px solid transparent;
      float: left;
      position: relative;
      min-width: 19.5%;
    }

    .course:hover {
      border-color: #ddd;
      box-shadow: 1px 1px 2px 1px #ececec;
      -webkit-box-shadow: 1px 1px 2px 1px #ececec;
    }

    a:hover {
      color: #f4621f;
      transition: none;
    }
  }

  .inner-hmv {
    box-shadow: none;
    background-color: #fff;
    border-radius: 8px;
  }

  // 无数据提醒
  .nulltips{
    padding: 100px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }

  // 价格排序
  ::v-deep .top-change .el-icon-caret-top {
    color: #000;
  }

  ::v-deep .bottom-change .el-icon-caret-bottom {
    color: #000;
  }

  ::v-deep .el-icon-caret-bottom {
    top: 9px;
    position: absolute;
    color: #dcdfe6;
  }

  ::v-deep .el-icon-caret-top {
    top: 1px;
    position: absolute;
    color: #dcdfe6;
  }
  // end
</style>
