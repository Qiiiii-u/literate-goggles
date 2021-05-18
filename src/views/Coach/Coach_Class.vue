<template>
  <div>
    <p class="card_title">班级查看</p>
    <el-card class="box-card">
      <el-row v-if="classList.length != 0">
        <el-col :xs="24" :sm="11" :md="6" :lg="6" :xl="6" v-for="item in classList" class="course" :style="randomRgb()">
          <div class="title" @click="toClass(item)">{{item.group_name}}</div>
          <div class="class_info">
            <div class="class_data">
              <span class="class_name">{{item.name}}</span>
              <el-link :underline="false" @click="toClass(item)">进入<i class="el-icon-arrow-right el-icon--right"></i>
              </el-link>
            </div>
          </div>
        </el-col>
      </el-row>
      <div v-else class="nulltips">
        暂未加入一个班级
      </div>
    </el-card>
  </div>
</template>

<script>
  import * as re_class from '../../network/coach/class.js'
  export default {
    name: 'Coach_Class',
    data() {
      return {
        user: '',
        is_login: false,
        userInfoList: [],
        classList: [],
        bg_color: ['lightcoral', 'lightsalmon', 'lightsteelblue', 'cadetblue', 'rosybrown', 'steelblue'],
      }
    },
    methods: {
      // 获取班级列表数据
      getList() {
        re_class.getClassInfo(this.userInfoList.uid).then(res => {
          // console.log(res.data)
          if (res.data.error_code == 0) {
            this.classList = res.data.data.list
          } else {
            this.classList = []
          }
        })
      },
      // 跳转至班级详情页
      toClass(val) {
        this.$router.push({
          name: 'Coach_Class_Detail',
          query: {
            class: JSON.stringify(val)
          }
        })
      },
      // 随机背景颜色
      randomRgb(item) {
        return {
          background: this.bg_color[Math.floor((Math.random() * this.bg_color.length))]
        }
      }
    },
    created() {
      this.is_login = this.$store.getters.getIsLogin
      this.user = this.$store.getters.getCurrentUser
      this.userInfoList = this.$store.getters.getCurrentUserList
      this.getList()
    },
  }
</script>

<style lang="scss" scoped>
  .card_title {
    font-size: 18px;
    font-weight: bold;
    margin: 5px 0;
  }

  .course {
    background-color: lightcoral;
    height: 200px;
    padding: 0;
    border-radius: 8px;
    margin: 9px;
    box-shadow: 0 12px 20px 0 rgba(95, 101, 105, 0.1);
    cursor: pointer;

    .class_info {
      background-color: white;
      bottom: 0;
      position: absolute;
      height: 25%;
      width: 100%;
      display: flex;
      align-items: center;
      font-size: 14px;
      padding-left: 10px;
    }

    .title {
      width: 100%;
      text-align: center;
      font-weight: bold;
      font-size: 20px;
      color: white;
      padding: 0 5px;
      // 文字居中显示
      justify-content: center;
      align-items: center;
      height: 75%;
      display: flex;
    }

    .class_data {
      width: 100%;

      .class_name {
        float: left;
      }

      ::v-deep .el-link.el-link--default {
        float: right;
      }

      ::v-deep .el-link.el-link--default:hover {
        color: #33a3dc;
      }

      ::v-deep .el-link--inner {
        color: #33a3dc;
      }
    }
  }

  .nulltips {
    padding: 30px 0;
    font-size: 16px;
    color: #9199a1;
    text-align: center;
    line-height: 24px;
    margin-bottom: 4px;
  }
</style>
