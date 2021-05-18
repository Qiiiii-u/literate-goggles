<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span><span class="line"></span>课程推荐</span>
    </div>
    <div class="recommend_box" v-for="item in recommendlist" @click="toDetail(item)">
      <el-image style="width: 90px; height: 60px" :src="'http://www.train.com/' + item.img" fit="cover"></el-image>
      <div class="recommend_data">
        <div class="recommend_title">{{item.group_name}}</div>
        <div class="recommend_intro"><span>{{item.newPrice}}<span
              v-if="item.course_count != 0">&nbsp;|&nbsp;共{{item.course_count}}节</span></span></div>
      </div>
    </div>
  </el-card>
</template>

<script>
  import * as re_course from '../../../network/front_course.js'
  import {
    deal2
  } from '../../../assets/js/normal.js'
  export default {
    name: 'FrontRecommend',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data() {
      return {
        recommendlist: []
      }
    },
    methods: {
      toDetail(val) {
        this.$emit('toDetail', val)
      },
      // 获取推荐课程列表
      getRecommendList() {
        re_course.getAllList().then(res => {
          if (res.data.error_code == 0) {
            this.recommendlist = res.data.data.list
            this.recommendlist = this.recommendlist.filter(item => {
              return item.group_name !== this.data.group_name
            })
            this.recommendlist = this.recommendlist.slice(0, 4)
            deal2(this.recommendlist)
          }
        })
      },
    },
    created() {
      console.log('recommend');
      this.getRecommendList()
    },
    watch:{
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.getRecommendList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

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

  // start recommend
  .recommend_box {
    padding-bottom: 10px;
    cursor: pointer;

    .recommend_data {
      display: inline-block;
      height: 60px;
      position: absolute;
      padding-left: 10px;
    }

    .recommend_title {
      height: 24px;
      line-height: 24px;
      color: #555666;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 4px;
    }

    .recommend_intro {
      font-size: 12px;
      color: #999;
      height: 24px;
      line-height: 24px;
      margin-top: 4px;
    }
  }


  // end recommend
</style>
