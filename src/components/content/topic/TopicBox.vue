<template>
  <div>
    <!-- head_img -->
    <el-avatar class="head_img" :size="48" :src="'http://www.train.com/' + data.head_img"
      :key="'http://www.train.com/' + data.head_img"></el-avatar>
    <!-- content -->
    <div class="topic_content">
      <span class="username">{{data.username}}</span>
      <div class="time">{{data.time}}</div>
      <div class="content">{{data.content}}</div>
      <!-- img -->
      <div class="pics" v-if="data.pics">
        <div v-for="pic in data.pics" class="pic" @click="preview(pic)">
          <el-image style="width: 120px; height: 120px;cursor: pointer;" :src="'http://www.train.com/' + pic"
            fit="cover"></el-image>
        </div>
      </div>
      <!-- opt -->
      <div style="color: #99a2aa;margin-top: 5px;">
        <!-- 评论 -->
        <span class="review_opt" @click="showReview()">
          <i class="el-icon-chat-dot-square icon"></i>
          <span class="review_label" v-if="data.reviews == 0">评论</span>
          <span class="review_label" v-else>{{data.reviews}}</span>
        </span>
        <!-- 点赞 -->
        <span class="agree_opt" @click="agreeTopic(data)">
          <i class="icon-zan" v-if="agree_topic.indexOf(data.id) >= 0 "
            style="margin: 3px;color: lightcoral;"></i>
          <i class="icon-empty" v-else style="margin: 3px;"></i>
          <span class="review_label" v-if="data.agree == 0">点赞</span>
          <span class="review_label" v-else>{{data.agree}}</span>
        </span>
      </div>
      <!-- end opt -->
    </div>
    <!-- end content -->
  </div>
</template>

<script>
    import * as re_topic from '../../../network/mine/home.js'
  export default {
    name: 'TopicBox',
    props: {
      data: {
        type: Object,
        default(){
          return {}
        }
      },
      agree_topic: {
        type: Array,
        default(){
          return []
        }
      }
    },
    data(){
      return {
        isClick: false
      }
    },
    methods:{
      // 点赞
      agreeTopic(val) {
        re_topic.agreeTopic(this.$store.getters.getCurrentUserList.uid,val.id,).then(res => {
            if (res.data.error_code == 0) {
              this.$emit('agreeTopic')
            }
          })
      },
      showReview(){
        this.isClick = !this.isClick
        this.$emit('showReview', this.isClick)
      },
      // 预览图片
      preview(val) {
        this.$emit('preview', val)
      },
    }
  }
</script>

<style lang="scss" scoped>
// start topic list
  .topic_box {
    .head_img {
      height: 48px;
      width: 48px;
      line-height: 40px;
      display: block;
      position: absolute;
    }

    .topic_content {
      margin-left: 65px;
    }

    .review_label {
      font-size: 12px;
      margin-left: 4px;
    }

    .username {
      color: #222;
      font-size: 16px;
      cursor: pointer;
    }

    .content {
      margin-top: 8px;
      font-size: 14px;
    }

    .pic {
      display: inline-block;
      border-radius: 4px;
      margin: 5px 0 0 7px;
    }

    .pics {
      margin-top: 5px;
      margin-left: -7px;
    }

    .icon {
      font-size: 18px;
    }

    .time {
      color: #99a2aa;
      font-size: 12px;
    }
  }

  ::v-deep .el-divider--horizontal {
    margin: 10px 0 30px 0;
  }

  .review_opt {
    cursor: pointer;
  }

  .review_opt:hover,
  .agree_opt:hover {
    color: lightcoral;
  }

  .agree_opt {
    margin-left: 80px;
    cursor: pointer;
  }

  // end topic list
</style>
