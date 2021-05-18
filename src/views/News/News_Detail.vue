<template>
  <div style="line-height: 1.80857;margin-bottom: 30px;">
    <h1 style="text-align: center;font-size: 24px;">{{data.title}}
      <div class="collect_wrap" @click="addCollect" v-if="is_login">
        <i class="el-icon-star-off" style="font-size: 18px;" v-if="flag == false"></i>
        <i class="el-icon-star-on" v-else style="color: lightcoral;font-size: 18px;"></i>
        <span style="font-size: 12px;">收藏</span>
      </div>
    </h1>

    <p style="text-align: center;color: gray;margin-bottom: 30px;">
      <span>{{data.views}}&nbsp;阅读&emsp;|&emsp;发表于&nbsp;{{data.oldtime ? data.oldtime : data.time}}&emsp;|&emsp;作者：{{data.author}}</span>
    </p>
    <p v-html="data.oldContent ? data.oldContent : data.content"></p>
  </div>
</template>

<script>
  import {
    addCollectKnow,
    getCollect,
    addScanKnow
  } from '../../network/news.js'
  export default {
    name: "News_Detail",
    data() {
      return {
        data: [],
        is_login: false,
        user: '',
        userInfoList: [],

        collectList: [],
        flag: false,
      }
    },
    methods: {
      addCollect() {
        if (this.is_login === true) {
          addCollectKnow(this.userInfoList.uid, this.data.knowledge_id).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.getCollect()
              console.log(this.flag)
            }
          })
        } else {
          this.$router.push('/Login')
        }
      },
      // 获取收藏夹列表
      getCollect() {
        if (this.is_login === true) {
          getCollect(this.user).then(res => {
            // console.log(res.data)
            if (res.data.error_code == 0) {
              this.collectList = res.data.data.filter(item => {
                return item.collect_type == 'knowledge'
              })
            } else {
              this.collectList = []
            }
            this.flag = this.collectList.some(item => {
              return item.knowledge_id == this.data.knowledge_id
            })

          })
        } else {
          this.collectList = []
          this.flag = false
        }
      },
      // 浏览量
      addScanKnow(){
        addScanKnow(this.data.knowledge_id).then(res => {
          this.data.views += 1
        })
      }
    },
    created() {
      if (this.$route.query.data) {
        this.data = JSON.parse(this.$route.query.data)
      }
      console.log(this.data)
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getCollect()
      this.addScanKnow()
    }
  }
</script>

<style lang="scss" scoped>
  .collect_wrap {
    display: inline-block;
    height: 30px;
    line-height: 30px;
    color: black;
    cursor: pointer;
  }

  .collect_wrap:hover {
    color: lightcoral;
  }
</style>
