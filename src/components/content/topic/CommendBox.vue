<template>
  <div>
    <div v-for="(re, i) in item.review_list" class="review_box">
      <el-avatar class="head_img" :size="48" :src="'http://www.train.com/' + re.head_img"
        :key="'http://www.train.com/' + re.head_img"></el-avatar>
      <div class="review_content">
        <span class="username">{{re.username}}</span>
        <div class="content">{{re.content}}</div>
        <div style="color: #99a2aa;">
          <div class="time">{{re.time}}</div>
          <span class="review_opt" @click="showCommed(i)">
            <i class="el-icon-chat-dot-square icon"></i>
            <span class="review_label" v-if="re.reviews == 0">评论</span>
            <span class="review_label" v-else>{{re.reviews}}</span>
          </span>
          <span class="agree_opt" @click="agreeCommed(re.id)">
            <i class="icon-zan" v-if="agree_commend.indexOf(re.id) >= 0"
              style="margin: 0 0 0 3px;color: lightcoral;font-size: 15px;"></i>
            <i class="icon-empty" v-else style="margin: 0 0 0 3px;font-size: 15px;"></i>
            <span class="review_label" v-if="re.agree == 0">点赞</span>
            <span class="review_label" v-else>{{re.agree}}</span>
          </span>
        </div>
      </div>

      <!-- start commend child -->
      <commend-child :re="re" v-if="click && commend==i"></commend-child>
      <div class="commend_box" v-if="click && commend==i">
        <el-avatar class="head_img" :size="48" style="position: absolute;"
          :src="'http://www.train.com/' + $store.getters.getCurrentUserList.head_img"
          :key="'http://www.train.com/' + $store.getters.getCurrentUserList.head_img"></el-avatar>
        <el-input v-model="commend_text" type="textarea" placeholder="发条评论……" maxlength="300" show-word-limit :rows="2">
        </el-input>
        <div style="display: inline-block;margin-left: 10px;">
          <a class="commend_button" @click="publishCommend(re.id)">回复</a>
        </div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>

</template>

<script>
  import CommendChild from './CommendChild.vue'
  import * as re_topic from '../../../network/mine/home.js'
  export default {
    name: 'CommendBox',
    components: {
      CommendChild
    },
    props: {
      item: {
        type: Object,
        default () {
          return {}
        }
      },
      agree_commend: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data() {
      return {
        click: false,
        commend: -1,
        commend_text: ''
      }
    },
    methods: {
      showCommed(i) {
        this.click = !this.click
        if (this.click == true) {
          this.commend = i
        } else {
          this.commend = -1
        }
      },
      agreeCommed(val) {
        // 点赞
        re_topic.agreeCommend(this.$store.getters.getCurrentUserList.uid, val).then(res => {
          if (res.data.error_code == 0) {
            this.$emit('agreeCommend')
          }
        })
      },
      publishCommend(val) {
        re_topic.publishCommend(this.$store.getters.getCurrentUserList.uid, val, this.commend_text).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.commend_text = ''
            this.$notify.success({
              title: '提示',
              message: '回复成功',
              showClose: false
            })
            this.$emit('CommendSuccess')
          } else {
            this.$notify.success({
              title: '提示',
              message: '哎呀，回复失败',
              showClose: false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .review_box {
    width: 50rem;
    margin: 0 auto;

    .review_content {
      margin-left: 65px;

      .username {
        font-size: 13px;
        font-weight: bold;
        color: #6d757a;
        cursor: pointer;
      }

      .content {
        margin: 0;
        font-size: 14px;
      }

      .review_opt {
        cursor: pointer;

        .icon {
          font-size: 15px;
        }
      }

      .review_opt:hover,
      .agree_opt:hover {
        color: lightcoral;
      }

      .agree_opt {
        margin-left: 20px;
        cursor: pointer;
      }

      .time {
        color: #99a2aa;
        font-size: 12px;
        display: inline-block;
        margin-right: 20px;
      }
    }
  }

  .commend_box {
    width: 100%;
    margin-left: 70px;
    margin-top: 15px;

    ::v-deep .el-textarea {
      width: 500px;
      padding-left: 65px;
    }

    .commend_button {
      display: inline-block;
      font-size: 14px;
      border: none;
      color: #fff;
      width: 50px;
      text-align: center;
      background: rgba(240, 20, 20, 0.6);
      border-radius: 4px;
      // height: 74px;
      padding-left: 10px;
      padding-right: 10px;
      line-height: 37px;
      cursor: pointer;
    }

    .commend_button:hover {
      background-color: #f01414;
    }
  }

  .review_label {
    font-size: 12px;
    margin-left: 4px;
  }
</style>
