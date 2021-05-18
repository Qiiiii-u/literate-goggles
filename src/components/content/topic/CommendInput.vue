<template>
  <div class="review_user">
    <el-avatar class="head_img" :size="48" :src="'http://www.train.com/' + this.$store.getters.getCurrentUserList.head_img"
      :key="'http://www.train.com/' + this.$store.getters.getCurrentUserList.head_img"></el-avatar>
    <el-input id="review" v-model="review_text" type="textarea" placeholder="发条评论……" maxlength="300" show-word-limit
      :rows="3"></el-input>
    <div style="display: inline-block;margin-left: 10px;">
      <a class="review_button" @click="publishReview(id)">发表评论</a>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
  import * as re_topic from '../../../network/mine/home.js'
  export default {
    name: 'CommendInput',
    props:{
      id: Number
    },
    data() {
      return {
        review_text: '',
      }
    },
    methods: {
      // 发表评论
      publishReview(item) {
        console.log(item);
        re_topic.publishReview(this.$store.getters.getCurrentUserList.uid, this.id, this.review_text).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.review_text = ''
            this.$notify.success({
              title: '提示',
              message: '发布成功',
              showClose: false
            })
            this.$emit('reviewSuccess')
          } else {
            this.$notify.success({
              title: '提示',
              message: '哎呀，发布失败',
              showClose: false
            })
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .review_user {
    width: 50rem;
    margin: 0 auto;

    ::v-deep .el-textarea {
      padding-left: 65px;
      width: 600px;
    }

    .head_img {
      height: 48px;
      width: 48px;
      line-height: 40px;
      display: block;
      position: absolute;
    }

    .review_button {
      display: inline-block;
      font-size: 14px;
      border: none;
      color: #fff;
      width: 50px;
      text-align: center;
      background: rgba(240, 20, 20, 0.6);
      border-radius: 4px;
      height: 74px;
      padding-left: 10px;
      padding-right: 10px;
      line-height: 37px;
    }
		.review_button:hover {
      background-color: #f01414;
    }
  }
  a{
    cursor: pointer;
  }
</style>
