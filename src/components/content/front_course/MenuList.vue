<template>
  <el-card class="box-card" shadow="never">
    <div slot="header" class="clearfix">
      <span><span class="line"></span>课程目录</span>
    </div>
    <div class="text item">
      <el-collapse>
        <el-collapse-item v-for="i in indexlist" :title="i" :name="i">
          <el-menu>
            <el-menu-item v-for="item in menulist[i]" :index="item.course_id" @click="toLearn(item)">
              <i class="icon-bofang1"></i>
              <span slot="title">{{item.course_name}}</span>
              <span class="time" v-if="$store.getters.getIsLogin == true && clist.includes(group_id)">
                {{item.course_name == course_name ? '最近学习' : null }}
                {{item.time}}
              </span>
              <span class="time" v-else>{{item.time}}</span>
            </el-menu-item>
          </el-menu>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script>
  import {
    durationDeal
  } from '../../../assets/js/normal.js'
  import * as re_course from '../../../network/front_course.js'
  export default {
    name: 'MenuList',
    props: {
      group_id: Number,
      course_name: String,
      clist: {
        type: Array,
        default () {
          return []
        }
      }
    },
    data(){
      return {
        menulist: [],
        indexlist: [],
      }
    },
    methods: {
      // 获取目录
      getMenuList() {
        re_course.getMenuList(this.group_id).then(res => {
          if (res.data.error_code == 0) {
            this.menulist = res.data.data.list
            this.indexlist = res.data.data.index
            this.dataDeal()
            this.indexlist.forEach(i => {
              durationDeal(this.menulist[i])
            })
          } else {
            this.menulist = []
            this.indexlist = []
          }
        })
      },
      // 数据处理
      dataDeal() {
        this.indexlist.forEach(i => {
          this.menulist[i].forEach(item => {
            item.course_id = item.course_id.toString()
          })
        })
      },
      toLearn(val) {
        this.$emit('toLearn', val)
      }
    },
    created() {
      this.getMenuList()
    },
    watch:{
      $route(to, from) {
        if (JSON.parse(to.query.data) != JSON.parse(from.query.data)) {
          this.getMenuList()
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

  // 手风琴
  ::v-deep .el-collapse {
    border: none;
  }

  ::v-deep .el-collapse-item__header {
    font-weight: bold;
    font-size: 14px;
  }

  ::v-deep .el-menu-item * {
    font-size: 14px;
  }

  ::v-deep .el-menu-item {
    height: 48px;
    line-height: 48px;
    font-size: 14px;

    .time {
      font-size: 12px;
      color: gray;
      float: right;
    }
  }

  ::v-deep .el-menu {
    border: none;
  }

  ::v-deep .el-menu-item:hover,
  ::v-deep .el-menu-item:focus {
    background-color: #ecf5ff;
  }

  ::v-deep .el-menu-item.is-active {
    color: #007BFF;
  }
</style>
