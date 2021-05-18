<template>
  <el-card class="box-card" shadow="never">
    <div class="text item" style="padding-top: 30px;" v-if="reviewlist.length != 0">
      <div v-for="item in reviewlist" class="review">
        <el-avatar :size="48" :src="'http://www.train.com/' + item.head_img"
          :key="'http://www.train.com/' + item.head_img"></el-avatar>
        <div style="padding-left: 65px;">
          <div class="user-wrap">
            <span class="username">{{item.username}}</span>
            <el-rate v-model="item.rate" disabled show-score text-color="#ff9900" score-template="{value}分"></el-rate>
          </div>
          <p class="content">{{item.content}}</p>
          <div class="time">{{item.time}}</div>
        </div>
        <el-divider></el-divider>
      </div>
    </div>
    <p class="more_review" v-if="showList[index]" @click="more_review">
      <a>查看更多评价<i class="el-icon-arrow-down"></i></a>
    </p>
    <p class="no_review" v-else :style="reviewlist.length == 0 ? 'padding-top: 20px;' : 'padding-top: 0;'">没有更多的评价了</p>
  </el-card>
</template>

<script>
  export default {
    name: "ReviewList",
    props: {
      index: Number,
      showList: {
        type: Array,
        default () {
          return []
        }
      },
      reviewlist: {
        type: Array,
        default () {
          return []
        }
      },
    },
    methods: {
      // 展示更多评价
      more_review() {
        this.$emit('changeIndex')
      },
    }
  }
</script>

<style lang="scss" scoped>
  .review {
    ::v-deep .el-avatar {
      display: block;
      position: absolute;
    }

    .user-wrap {
      display: flex;
      height: 40px;
      align-items: center;

      .username {
        font-weight: bold;
      }
    }

    ::v-deep .el-rate {
      position: absolute;
      right: 4%;
    }

    .content {
      line-height: 24px;
      font-size: 14px;
      color: #20232c;
      word-break: break-all;
    }

    .time {
      color: #999aaa;
      font-size: 13px;
    }

    .el-divider {
      background-color: #f5f6f7;
    }
  }

  .is_fixed {
    z-index: 999;
    position: fixed;
    top: 0;
    left: 50%;
    margin-left: -250px;
  }

  .more_review {
    text-align: center;
    font-size: 14px;
    color: #277ccc;
    margin-bottom: 0;
  }

  .no_review {
    text-align: center;
    font-size: 14px;
    color: #999aaa;
    margin-bottom: 0;
  }

  a{
    cursor: pointer;
  }
</style>
