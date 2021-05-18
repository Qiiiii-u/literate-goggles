<template>
  <div>
    <el-card class="box-card" shadow="never" style="margin-bottom: 8px;">
      <div slot="header" class="clearfix">
        <span><span class="line"></span>课程评价</span>
      </div>
      <!-- 评分 -->
      <el-row style="margin: 0;" :gutter="10">
        <el-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <el-rate class="total_rate" v-model="totalRate" disabled show-score text-color="#ff9900"></el-rate>
        </el-col>
        <el-col :xs="24" :sm="24" :md="19" :lg="19" :xl="19">
          <el-row class="percent_rate">
            <el-col v-for="(item, index) in percent" :xs="12" :sm="12" :md="4" :lg="4" :xl="4"
              style="padding-right: 15px;">
              <span>
                <el-progress :percentage="item.value" :show-text="false" color="#C0C4CC"></el-progress>
              </span>
              <span><span class="progress_text">{{item.value}}%</span>
                <el-rate :value="index" disabled></el-rate>
              </span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <!-- end rate -->
    </el-card>
    <!-- start user_review -->
    <el-card class="box-card" shadow="never" style="margin-bottom: 8px;"
      v-if="$store.getters.getIsLogin == true && clist.includes(data.group_id)">
      <div class="text item user_review" style="padding-top: 30px;">
        <div style="margin-bottom: 10px;"><span style="font-weight: bold;">评分：</span>
          <el-rate v-model="review_rate"></el-rate>
        </div>
        <div>
          <el-avatar class="user_head_img" :size="48"
            :src="'http://www.train.com/' + $store.getters.getCurrentUserList.head_img"
            :key="'http://www.train.com/' + $store.getters.getCurrentUserList.head_img"></el-avatar>
          <el-input v-model="review_text" type="textarea" placeholder="写下您对本课程的评价……" maxlength="300" show-word-limit
            :autosize="{ minRows: 4, maxRows: 8}"></el-input>
        </div>
        <a class="learn_button" @click="review()">提交</a>
      </div>
    </el-card>
    <!-- end user_review -->
    <!-- 评论列表 -->
    <review-list :index="index" :showList="showList" :reviewlist="reviewlist" @changeIndex="changeIndex"></review-list>
    <!-- end list -->
  </div>
</template>

<script>
  import * as re_course from '../../../network/front_course.js'
  import ReviewList from './ReviewList.vue'
  export default {
    name: 'RateReview',
    props: {
      data: {
        type: Object,
        default () {
          return {}
        }
      },
      clist: {
        type: Array,
        default () {
          return []
        }
      }
    },
    components: {
      ReviewList
    },
    data() {
      return {
        percent: [],
        totalRate: 5,
        reviewlist: [],
        showList: [], // 分页的评论列表
        index: 0, // 分页index
        review_text: '',
        review_rate: null,
      }
    },
    methods: {
      // 获取评论
      getReviewList() {
        re_course.getReview(this.data.group_id).then(res => {
          if (res.data.error_code == 0) {
            this.percent = res.data.data.per_rate
            // console.log(this.percent);
            this.totalRate = Math.floor(res.data.data.totalRate * 10) / 10
            this.showList = this.spArr(res.data.data.list, 5)
            this.reviewlist = this.showList[0]
            this.index = 0
            this.$emit('getRate', this.totalRate)
          } else {
            this.percent = []
            this.showList = []
            this.reviewlist = []
          }
        })
      },
      review() {
        re_course.UserReview(this.data.group_id, this.$store.getters.getCurrentUserList.uid, this.review_text, this
          .review_rate).then(res => {
          this.$message({
            type: 'success',
            message: '评论成功!'
          })
          this.getReviewList()
        })
      },
      // 切分数组
      spArr(arr, num) {
        let newArr = []
        for (let i = 0; i < arr.length;) {
          newArr.push(arr.slice(i, i += num));
        }
        return newArr
      },
      changeIndex() {
        this.index += 1
        // console.log(this.index);
        if (this.showList[this.index]) {
          this.reviewlist.push.apply(this.reviewlist, this.showList[this.index])
        }
      }

    },
    created() {
      console.log('Ratereview');
      this.getReviewList()
    },
    // 组件复用 数据刷新
    watch:{
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.getReviewList()
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

  .total_rate {
    ::v-deep .el-rate__icon {
      margin-right: 2px;
    }

    ::v-deep .el-rate__text {
      font-size: 24px;
    }

    ::v-deep .el-divider--vertical {
      height: 2em;
    }
  }

  .percent_rate {
    margin-left: 10px;

    ::v-deep .el-rate {
      display: inline-flex;
      height: 100%;
    }

    .progress_text {
      display: inline-flex;
      height: 100%;
      align-items: center;
      font-size: 12px;
      margin-right: 2px;
      color: #ff9900;
    }

    ::v-deep .el-rate__icon {
      font-size: 14px;
      margin-right: 2px;
    }

    li {
      list-style: none;
      margin-right: 20px;
    }
  }

  @media only screen and (min-width: 1200px) {
    ::v-deep .el-col-lg-4 {
      width: 20%;
    }
  }

  a {
    cursor: pointer;
  }

  // user review
  .user_review {
    ::v-deep .el-rate {
      display: inline-block;
    }

    ::v-deep .el-textarea {
      width: 90%;
      margin-left: 15px;
    }

    .user_head_img {
      display: inline-block;
      margin-bottom: 45px;
    }

    .learn_button {
      display: inline-block;
      margin: 10px 20px 20px 0;
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

    ::v-deep .el-textarea__inner:focus {
      border-color: lightcoral;
    }

  }
</style>
