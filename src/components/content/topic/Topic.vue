<template>
  <div>
    <el-card class="box-card" style="margin-bottom: 10px;" v-for="(item, index) in topicList" :key="index">
      <div class="text item">
        <div class="topic_box">
          <!-- start topic -->
          <TopicBox @preview="preview" :data="item" :agree_topic="agree_topic" @showReview="showReview($event,index)"
            @agreeTopic="agreeTopic"></TopicBox>
          <!-- end topic -->
          <el-divider v-if="isClick && isreview == index"></el-divider>
          <!-- 评论输入框 -->
          <commend-input @reviewSuccess="reviewSuccess" v-if="isClick && isreview == index" :id="item.id">
          </commend-input>
          <!-- 评论列表 -->
          <CommendBox :item="item" :agree_commend="agree_commend" v-if="isClick && isreview == index"
            @agreeCommend="agreeCommend" @CommendSuccess="CommendSuccess"></CommendBox>
        </div>
      </div>

    </el-card>
    <el-card class="box-card" style="margin-bottom: 10px;">
      <p class="more_review" v-if="showList[index]" @click="more_topic"><a>查看更多动态<i class="el-icon-arrow-down"></i></a>
      </p>
      <p class="no_review" v-else>没有更多的动态了</p>
    </el-card>
  </div>
</template>

<script>
  import * as re_topic from '../../../network/mine/home.js'
  import {
    changeTime
  } from '../../../assets/js/normal.js'
  import CommendInput from './CommendInput.vue'
  import TopicBox from './TopicBox.vue'
  import CommendBox from './CommendBox.vue'
  export default {
    name: 'Topic',
    components: {
      CommendInput,
      TopicBox,
      CommendBox
    },
    data() {
      return {
        isreview: -1,
        isClick: false,

        topicList: [],
        agree_topic: [],
        agree_commend: [],
        // 分页
        showList: [],
        index: 0,
      }
    },
    methods: {
      getList() {
        re_topic.getTopic(this.$store.getters.getCurrentUserList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {

            let data = res.data.data.list
            data.forEach(item => { // 时间显示处理
              item.time = changeTime(item.time)
              if (item.review_list) {
                item.review_list.forEach(review => {
                  review.time = changeTime(review.time)
                  if (review.child) {
                    review.child.forEach(i => {
                      i.time = changeTime(i.time)
                    })
                  }
                })
              }
            })

            this.showList = this.spArr(data, 10)
            this.topicList = this.showList[0]
            // this.topicList = res.data.data.list
            if (res.data.data.agree_topic || res.data.data.agree_commend) {
              this.agree_topic = res.data.data.agree_topic // 点赞
              this.agree_commend = res.data.data.agree_commend // 点赞
              // console.log(this.agree_topic)
              // console.log(this.agree_commend)
            } else {
              this.agree_topic = []
              this.agree_commend = []
            }
            // console.log(this.topicList)
          } else {
            this.topicList = []
            this.agree_topic = []
            this.agree_commend = []
            this.showList = []
          }
        })
      },
      // 展示更多
      more_topic() {
        this.index += 1
        if (this.showList[this.index]) {
          this.topicList.push.apply(this.topicList, this.showList[this.index])
        }
      },
      // 预览图片
      preview(val) {
        this.$emit('preview', val)
      },
      // 切分数组
      spArr(arr, num) {
        let newArr = []
        for (let i = 0; i < arr.length;) {
          newArr.push(arr.slice(i, i += num));
        }
        return newArr
      },
      showReview(val, index) {
        this.isClick = val
        if (this.isClick == false) {
          this.isreview = -1
        } else {
          this.isreview = index
        }
      },
      agreeTopic() {
        this.getList()
      },
      reviewSuccess() {
        this.getList()
      },
      agreeCommend() {
        this.getList()
      },
      CommendSuccess(){
        this.getList()
      }

    },
    created() {
      this.getList()
    }
  }
</script>

<style lang="scss" scoped>
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
  
  .publish:hover {
    background-color: #f01414;
  }
  
  ::v-deep .el-textarea__inner:focus {
    border-color: lightcoral;
  }
</style>
