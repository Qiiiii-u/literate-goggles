<template>
  <el-row>
    <el-col :xs="24" :sm="10" :md="10" :lg="5" :xl="5" v-for="item in recommendlist" class="course">
      <el-row>
        <el-col style="text-align: center;">
          <a @click="toCourse(item)" style="display: inline-block;">
            <el-image class="img" :src="'http://www.train.com/' + item.img" fit="contain"></el-image>
          </a>
        </el-col>
        <el-col>
          <a @click="toCourse(item)">
            <div class="title">{{item.group_name}}</div>
          </a>
        </el-col>
        <el-col>
          <div>
            <span class="intro"><span
                v-if="item.course_count != 0">共{{item.course_count}}节&nbsp;|&nbsp;</span>{{item.new_intro}}</span>
          </div>
        </el-col>
        <el-col>
          <div style="margin-bottom: 8px;padding: 0 8px;">
            <span class="price">{{item.newPrice}}</span>
            <span class="person">{{item.participants_num}}人最近报名</span>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import * as recommend from '../../network/mine/recommend_list.js'
  import {
    deal
  } from '../../assets/js/normal.js'
  export default {
    name: "RecommendList",
    data() {
      return {
        recommendlist: []
      }
    },
    methods: {
      // 获取推荐课程列表
      getRecommendList() {
        recommend.getAllList().then(res => {
          if (res.data.error_code == 0) {
            this.recommendlist = res.data.data.list
            this.recommendlist = this.recommendlist.slice(0, 4)
            deal(this.recommendlist)
          } else {
            this.recommendlist = []
          }
        })
      },
      toCourse(val) {
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
      }
    },
    created() {
      this.getRecommendList()
    }
  }
</script>

<style lang="scss" scoped>
  // start recommendlist
  .course {
    cursor: pointer;
    box-shadow: 0 4px 8px 0 rgba(95, 101, 105, .05);
    border-radius: 8px;
    margin: 15px;

    .title {
      margin-bottom: 2px;
      font-size: 14px;
      height: 40px;
      line-height: 1.5;
      padding: 0 8px;
    }

    .img {
      width: 196px;
      height: 124px;
      margin-bottom: 8px;
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
      padding: 0 8px;
    }

    a:hover {
      color: #f4621f;
      transition: none;
    }
  }

  .course:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px 0 rgba(95, 101, 105, .1);
  }

  // end recommendlist

  ::v-deep .el-col {
    // padding: 0!important;
  }

</style>
