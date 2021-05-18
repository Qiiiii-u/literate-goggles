<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span><span class="line"></span>加入班级</span>
    </div>
    <div class="text item" v-if="classList.length != 0">
      <el-row :gutter="10" style="margin: 0;">
        <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11" class="course" v-for="item in classList" style="padding: 0;">
          <div class="title" @click="joinClass(item)">{{item.name}}</div>
          <div class="class_info">
            <div class="class_data">
              <span class="class_name">开班时间：{{item.start_time}}~{{item.end_time}}
                <span v-if="isDuringDate(item.start_time, item.end_time) == 1"
                  style="color: firebrick; font-size: 13px;">（正在进行）</span>
                <span v-if="isDuringDate(item.start_time, item.end_time) == 2"
                  style="color: #999aaa; font-size: 13px;">（已结束）</span>
              </span>
              <span style="float: left;">学时安排：{{item.hour}}课时</span>
              <el-link :underline="false" @click="joinClass(item)">加入<i class="el-icon-arrow-right el-icon--right"></i></el-link>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-else class="nulltips">
      该课程教练尚未开班，请等待开课通知
    </div>
  </el-card>
</template>

<script>
  import * as re_course from '../../../network/front_course.js'
  export default {
    name: 'FrontClass',
    props:{
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data(){
      return {
        classList: []
      }
    },
    methods: {
      // 判断时间是否在开班时间内
      isDuringDate(beginDateStr, endDateStr) {
        let curDate = new Date()
        let beginDate = new Date(beginDateStr)
        let endDate = new Date(endDateStr)
        if (curDate >= beginDate && curDate <= endDate) { // ing
          return 1
        } else if (curDate < beginDate) { // will
          return 0
        } else if (curDate > endDate) { // end
          return 2
        }
      },
      joinClass(val) {
        this.$emit('joinClass', val)
      },
      // 获取班级列表数据
      getClassList() {
        re_course.getClassList(this.data.group_id).then(res => {
            if (res.data.error_code == 0) {
              this.classList = res.data.data.list
            } else {
              this.classList = []
            }
          })
      },
    },
    created() {
      this.getClassList()
    },
    watch:{
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.getClassList()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  // start class
  .course {
    background-color: lightsteelblue;
    height: 200px;
    padding: 0;
    border-radius: 8px;
    margin: 9px;
    box-shadow: 0 12px 20px 0 rgba(95, 101, 105, 0.1);
    // cursor: pointer;

    .class_info {
      background-color: white;
      bottom: 0;
      // position: absolute;
      height: 30%;
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
      height: 70%;
      display: flex;
      cursor: pointer;
    }

    .class_data {
      width: 100%;

      .class_name {
        float: left;
      }

      ::v-deep .el-link.el-link--default {
        float: right;
        cursor: pointer;
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

  // end class

  // 卡片
  // 标题前红色竖线
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

</style>
